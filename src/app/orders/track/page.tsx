// coteadmin/src/app/track/page.tsx
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, WashingMachine, HelpCircle } from 'lucide-react';
import { getBranding } from '@/lib/branding';

export default async function TrackSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  if (params.order) {
    redirect(`/track/${params.order.trim().toUpperCase()}`);
  }
  const b = await getBranding();
  const waNumber = b.phone?.replace(/\D/g, '').replace(/^0/, '62');

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2 bg-primary/5 rounded-full shadow-inner mb-2 border border-primary/10 overflow-hidden w-20 h-20">
            <Image 
              src="/logo.png" 
              alt={`Logo ${b.businessName}`}
              width={800} 
              height={800}
              className="object-contain"
              priority
            />
          </div>
          
          {/* Teks nama brand di bawahnya (bisa dihapus kalau di logomu sudah ada teksnya) */}
          <h1 className="text-3xl font-heading font-bold text-primary tracking-tight">
            {b.businessName}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Pantau status Order kesayanganmu kapan saja.
          </p>
        </div>

        {/* SEARCH CARD */}
        <Card className="shadow-xl shadow-primary/5 border-border">
          <CardHeader className="text-center pb-5">
            <CardTitle className="text-lg font-bold text-foreground">Lacak Pesanan</CardTitle>
            <CardDescription>
              Masukkan Nomor Order yang tertera pada struk atau pesan WhatsApp dari kami.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form method="GET" className="space-y-5">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={22} />
                <Input
                  name="order"
                  required
                  placeholder="Contoh: ORD-2026..."
                  className="pl-12 h-14 text-center text-lg font-bold tracking-wider uppercase bg-background shadow-sm border-input hover:border-primary/50 focus-visible:ring-primary transition-all"
                  aria-label="Nomor Order"
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
                Cek Status Sekarang
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FOOTER HELP */}
        {waNumber && (
        <div className="text-center flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <HelpCircle size={14} />
          <span>Lupa nomor order?</span>
          <a href={`https://wa.me/${waNumber}`} className="text-primary font-semibold hover:underline underline-offset-2">
            Hubungi Admin
          </a>
        </div>
        )}

      </div>
    </div>
  );
}