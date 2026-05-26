import { redirect } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { RegisterForm } from './register-form';

export const metadata = {
  title: 'Cadastro de Atleta — Atlas Birdie',
  description: 'Faça seu cadastro como atleta na plataforma Atlas Birdie.',
};

export async function registerAthlete(_prevState: unknown, formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const birthDate = formData.get('birthDate') as string;
  const gender = formData.get('gender') as string;
  const clubId = formData.get('clubId') as string | null;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const tenantId = process.env['DEFAULT_TENANT_ID'] ?? '';

  if (!name || !email || !birthDate || !gender) {
    console.error('[registerAthlete] Validation failed', { name, email, birthDate, gender });
    return { error: 'Preencha todos os campos obrigatórios.' };
  }

  const baseUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';
  console.log('[registerAthlete] Calling API', { baseUrl });

  try {
    const res = await fetch(`${baseUrl}/api/athletes/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        name,
        email,
        birthDate: new Date(birthDate).toISOString(),
        gender,
        clubId: clubId || undefined,
        city,
        state,
      }),
    });

    console.log('[registerAthlete] API response', { status: res.status });

    if (!res.ok) {
      let message = 'Erro ao realizar cadastro. Tente novamente.';

      try {
        const json = (await res.json()) as { error?: string };
        console.error('[registerAthlete] API error body', json);
        if (json.error) message = json.error;
      } catch (parseError) {
        console.error('[registerAthlete] Failed to parse error response', parseError);
      }

      return { error: message };
    }
  } catch (error) {
    console.error('[registerAthlete] Network or fetch error', {
      baseUrl,
      error,
    });
    return {
      error: 'Não foi possível conectar ao servidor. Verifique se a API está rodando.',
    };
  }

  console.log('[registerAthlete] Success, redirecting');
  redirect('/register/success');
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Cadastro de Atleta</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Preencha os dados abaixo. Seu perfil será revisado pelo administrador da federação.
          </p>
        </div>
        <RegisterForm action={registerAthlete} />
      </main>
    </div>
  );
}
