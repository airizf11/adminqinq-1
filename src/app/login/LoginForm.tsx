// coteadmin/src/app/login/LoginForm.tsx
// coteadmin/src/app/login/LoginForm.tsx

'use client';

import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from './actions';
import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="relative overflow-hidden border-border/80 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur">
      {/* Decorative accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"
      />

      <CardHeader className="px-5 pb-5 pt-7 text-center sm:px-7">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck size={19} strokeWidth={2.2} />
        </div>

        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
          Selamat Datang
        </CardTitle>

        <CardDescription className="mx-auto mt-1 max-w-sm text-sm leading-relaxed">
          Masuk menggunakan akun Google Anda untuk melanjutkan.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-5 pb-6 sm:px-7 sm:pb-7">
        {/* Google Login / Loading */}
        {isLoading ? (
          <div className="flex min-h-[74px] flex-col items-center justify-center gap-2.5 rounded-xl border border-primary/10 bg-primary/5 animate-in fade-in duration-300">
            <Loader2
              size={24}
              className="animate-spin text-primary"
            />

            <p className="text-sm font-medium text-muted-foreground">
              Memverifikasi akun...
            </p>
          </div>
        ) : (
          <div className="flex min-h-[74px] w-full items-center justify-center rounded-xl border border-border/70 bg-background/60 animate-in fade-in duration-300">
            <GoogleLogin
              onSuccess={async (credResp) => {
                if (!credResp.credential) return;

                setIsLoading(true);
                setError(null);

                const result = await googleLogin(
                  credResp.credential
                );

                if (result?.error) {
                  setError(result.error);
                  setIsLoading(false);
                }
              }}
              onError={() => {
                setError(
                  'Proses Login Google gagal. Silakan coba lagi.'
                );
                setIsLoading(false);
              }}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-destructive animate-in slide-in-from-top-2 duration-300">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold">
                Login gagal
              </p>

              <p className="mt-0.5 text-xs leading-relaxed text-destructive/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/70" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
              Pintu Manual
            </span>
          </div>
        </div>

        {/* Manual fallback */}
        <div className="space-y-3 text-center">
          <p className="mx-auto max-w-xs text-[11px] leading-relaxed text-muted-foreground">
            Sudah berhasil login namun halaman belum berpindah
            otomatis? Gunakan tombol di bawah ini.
          </p>

          <Link
            href="/dashboard"
            className="block w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Button
              variant="outline"
              className="group h-11 w-full cursor-pointer rounded-xl border-primary/20 text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-sm active:translate-y-0"
            >
              <span>Ke Dashboard</span>

              <ArrowRight
                size={16}
                className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}