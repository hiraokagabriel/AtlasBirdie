import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as XLSX from 'xlsx';
import { createAthleteService } from '../../services/athlete.service.js';
import { verifyAuth, verifyRole } from '../../middlewares/auth.js';

// ---------------------------------------------------------------------------
// Schema de validação de cada linha da planilha
// ---------------------------------------------------------------------------
const rowSchema = z.object({
  nome: z.string().min(2).max(120),
  email: z.string().email().optional(),
  data_nascimento: z.string().optional(),
  genero: z.enum(['M', 'F']).optional(),
  lateralidade: z.enum(['R', 'L']).optional(),
  cpf: z
    .string()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
    .transform((v) => v.replace(/[^\d]/g, ''))
    .optional(),
  clube_id: z.string().optional(),
  cidade: z.string().max(100).optional(),
  estado: z.string().max(2).optional(),
  pais: z.string().length(2).default('BR'),
});

type RowInput = z.input<typeof rowSchema>;

interface ParsedRow {
  line: number;
  data: z.infer<typeof rowSchema>;
}

interface ErrorRow {
  line: number;
  raw: RowInput;
  errors: Record<string, string[]>;
}

interface DuplicateRow {
  line: number;
  field: 'document' | 'slug';
  conflictWith: string;
}

interface ImportReport {
  total: number;
  valid: ParsedRow[];
  errors: ErrorRow[];
  duplicates: DuplicateRow[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseWorkbook(buffer: Buffer): RowInput[] {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0] ?? ''];
  if (!ws) throw new Error('Planilha vazia');
  return XLSX.utils.sheet_to_json<RowInput>(ws, { defval: undefined });
}

async function validateRows(
  rows: RowInput[],
  service: ReturnType<typeof createAthleteService>,
  tenantId: string,
): Promise<ImportReport> {
  const valid: ParsedRow[] = [];
  const errors: ErrorRow[] = [];
  const duplicates: DuplicateRow[] = [];
  const seenDocuments = new Set<string>();
  const seenSlugs = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const line = i + 2; // linha 1 = header
    const raw = rows[i] as RowInput;
    const parsed = rowSchema.safeParse(raw);

    if (!parsed.success) {
      errors.push({ line, raw, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> });
      continue;
    }

    const data = parsed.data;
    const slug = generateSlug(data.nome);

    // Duplicado dentro da própria planilha
    if (data.cpf && seenDocuments.has(data.cpf)) {
      duplicates.push({ line, field: 'document', conflictWith: `linha anterior` });
      continue;
    }
    if (seenSlugs.has(slug)) {
      duplicates.push({ line, field: 'slug', conflictWith: `linha anterior (nome duplicado)` });
      continue;
    }

    // Duplicado no banco
    if (data.cpf) {
      const existing = await service.findByDocument(tenantId, data.cpf);
      if (existing) {
        duplicates.push({ line, field: 'document', conflictWith: existing.slug });
        continue;
      }
      seenDocuments.add(data.cpf);
    }
    seenSlugs.add(slug);
    valid.push({ line, data });
  }

  return { total: rows.length, valid, errors, duplicates };
}

// ---------------------------------------------------------------------------
// Template XLSX
// ---------------------------------------------------------------------------
function buildTemplateBuffer(): Buffer {
  const headers = [
    'nome', 'email', 'data_nascimento', 'genero',
    'lateralidade', 'cpf', 'clube_id', 'cidade', 'estado', 'pais',
  ];
  const example = [
    'João Silva', 'joao@email.com', '1995-03-15', 'M', 'R', '123.456.789-09', '', 'São Paulo', 'SP', 'BR',
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  // Larguras
  ws['!cols'] = headers.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, 'Atletas');
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as ArrayBuffer);
}

// ---------------------------------------------------------------------------
// Rotas
// ---------------------------------------------------------------------------
export default async function athleteImportRoutes(app: FastifyInstance) {
  const service = createAthleteService(app.prisma);

  /**
   * GET /api/athletes/import/template
   * Download do arquivo modelo .xlsx
   */
  app.get(
    '/import/template',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER')] },
    async (_request, reply) => {
      const buffer = buildTemplateBuffer();
      return reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', 'attachment; filename="modelo-importacao-atletas.xlsx"')
        .send(buffer);
    },
  );

  /**
   * POST /api/athletes/import/preview
   * Valida a planilha sem persistir. Retorna relatório completo.
   */
  app.post(
    '/import/preview',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN', 'TOURNAMENT_ORGANIZER')] },
    async (request, reply) => {
      const tenantId = (request.query as { tenantId?: string }).tenantId;
      if (!tenantId) {
        return reply.code(400).send({ error: 'tenantId é obrigatório', code: 'MISSING_TENANT' });
      }

      const data = await request.file();
      if (!data) return reply.code(400).send({ error: 'Arquivo não enviado', code: 'MISSING_FILE' });

      const buffer = await data.toBuffer();
      let rows: RowInput[];
      try {
        rows = parseWorkbook(buffer);
      } catch (e) {
        return reply.code(422).send({ error: 'Não foi possível ler a planilha', code: 'INVALID_FILE', details: String(e) });
      }

      const report = await validateRows(rows, service, tenantId);
      return reply.send({ data: report });
    },
  );

  /**
   * POST /api/athletes/import/confirm
   * Persiste apenas as linhas válidas de um preview anterior.
   * Body: { tenantId, rows: ParsedRow[] } (retornado pelo preview)
   */
  app.post(
    '/import/confirm',
    { preHandler: [verifyAuth, verifyRole('SUPER_ADMIN', 'FEDERATION_ADMIN')] },
    async (request, reply) => {
      const bodySchema = z.object({
        tenantId: z.string().min(1),
        rows: z.array(
          z.object({
            line: z.number(),
            data: rowSchema,
          }),
        ).min(1),
      });

      const body = bodySchema.safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: 'Validation error', code: 'INVALID_BODY', details: body.error.flatten() });
      }

      const { tenantId, rows } = body.data;
      const created: string[] = [];
      const failed: { line: number; reason: string }[] = [];

      for (const { line, data } of rows) {
        const slug = generateSlug(data.nome);
        try {
          const athlete = await service.create({
            tenantId,
            name: data.nome,
            slug,
            document: data.cpf,
            birthDate: data.data_nascimento ? new Date(data.data_nascimento) : undefined,
            gender: data.genero,
            handedness: data.lateralidade,
            clubId: data.clube_id,
            city: data.cidade,
            state: data.estado,
            country: data.pais,
          });
          created.push(athlete.id);
        } catch (e) {
          failed.push({ line, reason: e instanceof Error ? e.message : 'Erro desconhecido' });
        }
      }

      return reply.code(201).send({
        data: {
          created: created.length,
          failed: failed.length,
          createdIds: created,
          failedDetails: failed,
        },
      });
    },
  );
}
