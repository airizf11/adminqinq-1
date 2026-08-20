// coteadmin/src/app/track/page.tsx
// coteadmin/src/app/track/page.tsx

import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Search,
  HelpCircle,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { getBranding } from '@/lib/branding';

export default async function TrackSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  if (params.order) {
    redirect(`/track/${params.order.trim()}`);
  }

  const b = await getBranding();
  const waNumber = b.phone?.replace(/\D/g, '').replace(/^0/, '62');

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-info/5 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main entrance */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Brand */}
          <div className="mb-7 text-center">
            <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">
              {/* Soft glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2rem] bg-primary/15 blur-xl"
              />

              {/* Logo container */}
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-primary/15 bg-card shadow-lg shadow-primary/10">
                <div
      aria-hidden="true"
      className="absolute inset-2 rounded-xl bg-primary/10"
    />
    <Search
      size={34}
      strokeWidth={2.25}
      className="relative text-primary"
    />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">
                {b.businessName}
              </h1>

              <Sparkles
                size={17}
                className="text-primary/60"
                aria-hidden="true"
              />
            </div>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Pantau status ordermu dengan mudah,
              kapan saja.
            </p>
          </div>

          {/* Search card */}
          <Card className="overflow-hidden border-border/80 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur">
            {/* Decorative top line */}
            <div
              aria-hidden="true"
              className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30"
            />

            <CardHeader className="px-5 pb-4 pt-6 text-center sm:px-7">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Search size={19} />
              </div>

              <CardTitle className="text-lg font-bold tracking-tight text-foreground">
                Lacak Pesanan
              </CardTitle>

              <CardDescription className="mx-auto mt-1 max-w-sm text-sm leading-relaxed">
                Masukkan nomor order yang tertera pada
                struk atau pesan WhatsApp.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
              <form method="GET" className="space-y-4">
                {/* Order input */}
                <div className="space-y-2">
                  <label
                    htmlFor="order"
                    className="ml-1 text-xs font-semibold text-muted-foreground"
                  >
                    Nomor Order
                  </label>

                  <div className="group relative">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary"
                      aria-hidden="true"
                    />

                    <Input
                      id="order"
                      name="order"
                      required
                      autoComplete="off"
                      placeholder="cth: cerdas-x7k9p2"
                      className="h-14 rounded-xl border-input bg-background pl-12 pr-4 text-center text-base font-bold uppercase tracking-[0.12em] shadow-sm transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground/50 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                      aria-label="Nomor Order"
                    />
                  </div>

                  <p className="px-1 text-[11px] text-muted-foreground/70">
                    Tidak perlu memasukkan spasi tambahan.
                  </p>
                </div>

                {/* CTA */}
                <Button
                  type="submit"
                  size="lg"
                  className="group h-14 w-full cursor-pointer rounded-xl text-base font-bold shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>Cek Status Sekarang</span>

                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Help */}
          {waNumber && (
            <div className="mt-5 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
                <HelpCircle
                  size={14}
                  className="shrink-0"
                  aria-hidden="true"
                />

                <span>Lupa nomor order?</span>

                <a
                  href={`https://wa.me/${waNumber}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 transition-colors hover:text-primary-hover hover:underline"
                >
                  <MessageCircle size={13} />
                  Hubungi Admin
                </a>
              </div>
            </div>
          )}

          {/* Small footer hint */}
          <p className="mt-7 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/40">
            Order Tracking
          </p>
        </div>
      </div>
    </main>
  );
}