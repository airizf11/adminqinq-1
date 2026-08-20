// coteadmin/src/app/login/page.tsx
import { Building2 } from 'lucide-react';
import { getBranding } from '@/lib/branding';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const b = await getBranding();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-info/5 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">
            {/* Soft glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[2rem] bg-primary/15 blur-xl"
            />

            {/* Brand icon */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-primary/15 bg-card shadow-lg shadow-primary/10">
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-xl bg-primary/10"
              />

              <Building2
                size={34}
                strokeWidth={2.25}
                className="relative text-primary"
              />
            </div>
          </div>

          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">
            {b.businessName}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Masuk untuk melanjutkan
          </p>
        </div>

        {/* Login */}
        <LoginForm />

        {/* Footer */}
        <p className="mt-7 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/40">
          Secure Access
        </p>
      </div>
    </main>
  );
}