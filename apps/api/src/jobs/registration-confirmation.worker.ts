import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Resend } from 'resend';

const connection = new IORedis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const resend = new Resend(process.env['RESEND_API_KEY']);

interface RegistrationJobData {
  athleteId: string;
  athleteName: string;
  email: string;
}

export const registrationWorker = new Worker<RegistrationJobData>(
  'registration-confirmation',
  async (job) => {
    const { athleteName, email } = job.data;

    await resend.emails.send({
      from: process.env['EMAIL_FROM'] ?? 'noreply@atlasbirdie.com.br',
      to: email,
      subject: 'Cadastro recebido — Atlas Birdie',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #28251d;">
          <h2 style="color: #01696f;">Olá, ${athleteName}!</h2>
          <p>Recebemos seu cadastro na plataforma Atlas Birdie.</p>
          <p>Seu perfil está em análise e será ativado em breve pelo administrador da federação.</p>
          <p style="margin-top: 32px; color: #7a7974; font-size: 13px;">Equipe Atlas Birdie</p>
        </div>
      `,
    });
  },
  { connection },
);

registrationWorker.on('failed', (job, err) => {
  console.error(`[registration-worker] job ${job?.id} failed:`, err);
});
