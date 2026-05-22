import type { FastifyInstance } from 'fastify'
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryParamsSchema,
  ListCategoriesQuerySchema,
} from '@atlas-birdie/validators'
import { CategoryService } from '../../services/category.service'

export async function categoryRoutes(app: FastifyInstance) {
  const svc = new CategoryService(app.prisma)

  // GET /categories
  app.get(
    '/categories',
    {
      schema: {
        tags: ['categories'],
        summary: 'List categories for the current tenant',
        querystring: {
          type: 'object',
          properties: {
            discipline: { type: 'string', enum: ['MS', 'WS', 'MD', 'WD', 'XD'] },
            isActive: { type: 'boolean' },
            page: { type: 'number', default: 1 },
            perPage: { type: 'number', default: 20 },
          },
        },
      },
    },
    async (req, reply) => {
      const tenantId = req.tenantId // injected by auth middleware
      const query = ListCategoriesQuerySchema.parse(req.query)
      const result = await svc.list(tenantId, query)
      return reply.send(result)
    },
  )

  // POST /categories
  app.post(
    '/categories',
    {
      schema: {
        tags: ['categories'],
        summary: 'Create a new category (federation_admin only)',
      },
    },
    async (req, reply) => {
      const tenantId = req.tenantId
      const input = CreateCategorySchema.parse(req.body)
      const category = await svc.create(tenantId, input)
      return reply.status(201).send({ data: category })
    },
  )

  // PATCH /categories/:id
  app.patch(
    '/categories/:id',
    {
      schema: {
        tags: ['categories'],
        summary: 'Update a category',
      },
    },
    async (req, reply) => {
      const tenantId = req.tenantId
      const { id } = CategoryParamsSchema.parse(req.params)
      const input = UpdateCategorySchema.parse(req.body)
      const category = await svc.update(tenantId, id, input)
      return reply.send({ data: category })
    },
  )

  // DELETE /categories/:id
  app.delete(
    '/categories/:id',
    {
      schema: {
        tags: ['categories'],
        summary: 'Soft-delete a category',
      },
    },
    async (req, reply) => {
      const tenantId = req.tenantId
      const { id } = CategoryParamsSchema.parse(req.params)
      await svc.softDelete(tenantId, id)
      return reply.status(204).send()
    },
  )
}
