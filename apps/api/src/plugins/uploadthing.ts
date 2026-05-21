import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { createUploadthing } from 'uploadthing/fastify';
import type { FileRouter } from 'uploadthing/fastify';

const f = createUploadthing();

export const uploadRouter = {
  athletePhoto: f({
    image: { maxFileSize: '5MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export default fp(async function uploadthingPlugin(app: FastifyInstance) {
  // Registra a rota /api/uploadthing para o client do frontend
  const { createRouteHandler } = await import('uploadthing/fastify');
  const handler = createRouteHandler({ router: uploadRouter });

  app.all('/api/uploadthing', async (request, reply) => {
    return handler(request, reply);
  });

  app.log.info('Uploadthing plugin registered at /api/uploadthing');
},
{ name: 'uploadthing' });
