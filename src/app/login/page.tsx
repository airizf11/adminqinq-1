// adminqinq/src/app/login/page.tsx
'use client';

import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from './actions';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WashingMachine, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. BRANDING HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-full shadow-inner mb-2 border border-primary/10">
            <WashingMachine size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary tracking-tight">
            Qinq <span className="text-secondary">Laundry</span>
          </h1>
        </div>

        {/* 2. LOGIN CARD */}
        <Card className="shadow-xl shadow-primary/5 border-border bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-bold text-foreground">Selamat Datang, Admin!</CardTitle>
            <CardDescription>
              Silakan masuk menggunakan akun Google Anda untuk melanjutkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            
            {/* GOOGLE LOGIN BUTTON & LOADING STATE */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 text-muted-foreground animate-in fade-in">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm font-medium">Memverifikasi akun...</p>
              </div>
            ) : (
              <div className="w-full flex justify-center animate-in fade-in">
                <GoogleLogin
                  onSuccess={async (credResp) => {
                    if (!credResp.credential) return;
                    setIsLoading(true); // Nyalakan loading
                    setError(null);
                    const result = await googleLogin(credResp.credential);
                    
                    // Jika sukses (redirect dari backend/actions), komponen ini otomatis unmount.
                    // Tapi jika ada error, kita matikan loading dan tampilkan pesan.
                    if (result?.error) {
                      setError(result.error);
                      setIsLoading(false);
                    }
                  }}
                  onError={() => {
                    setError('Proses Login Google gagal. Silakan coba lagi.');
                    setIsLoading(false);
                  }}
                  useOneTap
                  theme="outline"
                  size="large"
                  shape="pill"
                />
              </div>
            )}

            {/* ERROR ALERT */}
            {error && (
              <div className="w-full flex items-start gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* 3. DIVIDER MANUAL AKSES */}
            <div className="relative w-full pt-2">
              <div className="absolute inset-0 flex items-center mt-2">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest mt-2">
                <span className="bg-background px-3 text-muted-foreground">Pintu Manual</span>
              </div>
            </div>

            {/* 4. FALLBACK BUTTON */}
            <div className="w-full text-center space-y-3 pt-2">
              <p className="text-[11px] text-muted-foreground leading-relaxed px-4">
                Sudah berhasil login namun halaman tidak berpindah otomatis? Gunakan tombol di bawah ini.
              </p>
              {/* Asumsi rute utama dashboard adalah /orders, silakan sesuaikan jika rute defaultnya '/' */}
              <Link href="/orders" className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                >
                  Ke Dashboard <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}