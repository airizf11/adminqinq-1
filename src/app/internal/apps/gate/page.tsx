// coteadmin/src/app/internal/apps/gate/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function checkGate(formData: FormData) {
  'use server';
  const input = formData.get('secret') as string;
  if (input === process.env.INTERNAL_GATE_SECRET) {
    const store = await cookies();
    store.set('internal_gate', input, { httpOnly: true, maxAge: 60 * 60 * 24 });
    redirect('/internal/apps');
  }
  redirect('/internal/apps/gate?error=1');
}

export default async function GatePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form action={checkGate} className="space-y-3 w-full max-w-xs">
        <input
          type="password"
          name="secret"
          placeholder="Secret key"
          className="w-full h-11 px-3 border rounded-md"
          required
        />
        {error && <p className="text-sm text-red-600">Salah, coba lagi.</p>}
        <button type="submit" className="w-full h-11 bg-primary text-primary-foreground rounded-md">
          Masuk
        </button>
      </form>
    </div>
  );
}