import type { FastifyInstance } from 'fastify'

// BWF disciplines are a fixed enum — no DB table needed
const DISCIPLINES = [
  { code: 'MS', name: "Men's Singles", isDoubles: false, allowedGender: 'M' },
  { code: 'WS', name: "Women's Singles", isDoubles: false, allowedGender: 'F' },
  { code: 'MD', name: "Men's Doubles", isDoubles: true, allowedGender: 'M' },
  { code: 'WD', name: "Women's Doubles", isDoubles: true, allowedGender: 'F' },
  { code: 'XD', name: 'Mixed Doubles', isDoubles: true, allowedGender: 'ANY' },
] as const

export async function disciplineRoutes(app: FastifyInstance) {
  app.get(
    '/disciplines',
    {
      schema: {
        tags: ['disciplines'],
        summary: 'List all BWF standard disciplines',
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'array' },
            },
          },
        },
      },
    },
    async (_req, reply) => {
      return reply.send({ data: DISCIPLINES })
    },
  )
}
