import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAthleteService } from '../athlete.service.js';

const mockPrisma = {
  athlete: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn((args: unknown[]) => Promise.all(args)),
};

describe('AthleteService', () => {
  let service: ReturnType<typeof createAthleteService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = createAthleteService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated athletes with meta', async () => {
      const athletes = [{ id: '1', name: 'João Silva', slug: 'joao-silva' }];
      mockPrisma.athlete.findMany.mockResolvedValue(athletes);
      mockPrisma.athlete.count.mockResolvedValue(1);

      const result = await service.list({ page: 1, perPage: 20 });

      expect(result.data).toEqual(athletes);
      expect(result.meta).toEqual({ total: 1, page: 1, perPage: 20, totalPages: 1 });
    });

    it('filters by status when provided', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([]);
      mockPrisma.athlete.count.mockResolvedValue(0);

      await service.list({ status: 'ACTIVE' });

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'ACTIVE' }) }),
      );
    });

    it('excludes soft-deleted athletes', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([]);
      mockPrisma.athlete.count.mockResolvedValue(0);

      await service.list({});

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ deletedAt: null }) }),
      );
    });
  });

  describe('getBySlug', () => {
    it('returns athlete when found', async () => {
      const athlete = { id: '1', name: 'João', slug: 'joao' };
      mockPrisma.athlete.findFirst.mockResolvedValue(athlete);

      const result = await service.getBySlug('joao');
      expect(result).toEqual(athlete);
    });

    it('returns null when not found', async () => {
      mockPrisma.athlete.findFirst.mockResolvedValue(null);

      const result = await service.getBySlug('unknown');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates athlete with given input', async () => {
      const input = { tenantId: 't1', name: 'Maria', slug: 'maria', country: 'BR' };
      const created = { id: 'new', ...input };
      mockPrisma.athlete.create.mockResolvedValue(created);

      const result = await service.create(input);
      expect(result).toEqual(created);
      expect(mockPrisma.athlete.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('softDelete', () => {
    it('sets deletedAt to current date', async () => {
      mockPrisma.athlete.update.mockResolvedValue({ id: '1', deletedAt: new Date() });

      await service.softDelete('1');

      expect(mockPrisma.athlete.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      });
    });
  });
});
