// adminqinq/src/app/track/[orderNumber]/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Check, 
  SearchX, 
  ArrowLeft, 
  AlertCircle, 
  CalendarClock, 
  Ban,
  ShoppingBag,
  Clock
} from 'lucide-react';

type TrackingData = {
  orderNumber: string;
  status: string;
  paymentStatus: 'PAID' | 'UNPAID';
  dueDate: string | null;
  createdAt: string;
  customerName: string | null;
  items: { itemName: string; qty: number }[];
  statusHistory: { status: string | null; timestamp: string }[];
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: 'Diterima',
  IN_PROCESS: 'Diproses',
  READY: 'Siap Diambil',
  DONE: 'Selesai',
};

const ALL_STEPS = ['RECEIVED', 'IN_PROCESS', 'READY', 'DONE'];

export default async function TrackOrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;

  let data: TrackingData | null = null;

  try {
    const res = await cotebek<{ data: TrackingData }>(`/orders/track/${orderNumber}`, { requireAuth: false });
    data = res.data;
  } catch {
    data = null;
  }

  // --- 1. ERROR / NOT FOUND STATE ---
  if (!data) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center shadow-lg border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-2">
              <SearchX size={32} className="text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Order Tidak Ditemukan</h1>
              <p className="text-sm text-muted-foreground mt-1">Coba periksa kembali nomor order pada struk kamu.</p>
            </div>
            <Link 
              href="/track" 
              className={cn(buttonVariants({ variant: "default" }), "mt-4 w-full")}
            >
              <ArrowLeft size={16} className="mr-2" /> Lacak Nomor Lain
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- DATA PREPARATION ---
  const isCancelled = data.status === 'CANCELLED';
  const currentStepIndex = ALL_STEPS.indexOf(data.status);
  const historyByStatus = new Map(data.statusHistory.filter((h) => h.status).map((h) => [h.status, h.timestamp]));

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- 2. HEADER RESI --- */}
        <div className="flex items-center gap-3 mb-2">
          <Link 
            href="/track" 
            className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kembali ke pencarian"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            Lacak Order
          </h1>
        </div>

        {/* --- 3. KARTU IDENTITAS PELANGGAN --- */}
        <Card className="shadow-sm border-border">
          <CardContent className="p-4 flex justify-between items-start">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Nomor Order</div>
              <div className="font-bold text-primary tracking-wide">{data.orderNumber}</div>
            </div>
            {data.customerName && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Pelanggan</div>
                <div className="font-semibold text-foreground">{data.customerName}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- 4. ALERT PEMBAYARAN & BATAL --- */}
        {isCancelled ? (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
            <Ban size={20} className="shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Pesanan Dibatalkan</h3>
              <p className="text-xs mt-1 opacity-90">Pesanan ini telah dibatalkan dan tidak lagi diproses.</p>
            </div>
          </div>
        ) : (
          data.paymentStatus === 'UNPAID' && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 shadow-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-sm text-yellow-700">Belum Lunas</h3>
                <p className="text-xs mt-1 text-yellow-700/80">Mohon siapkan pembayaran saat pengambilan cucian nanti ya.</p>
              </div>
            </div>
          )
        )}

        {/* --- 5. TIMELINE STATUS (GARIS WAKTU) --- */}
        {!isCancelled && (
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-2 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Riwayat Perjalanan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4" aria-label="Status perjalanan cucian">
                {ALL_STEPS.map((step, i) => {
                  const isPast = i < currentStepIndex;
                  const isActive = i === currentStepIndex;
                  const isFuture = i > currentStepIndex;
                  const timestamp = step === 'RECEIVED' ? data!.createdAt : historyByStatus.get(step);

                  return (
                    <div key={step} className="relative pl-6">
                      {/* Titik / Indikator */}
                      <div className={cn(
                        "absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                        isPast ? "bg-emerald-500 ring-4 ring-emerald-500/20 text-white" :
                        isActive ? "bg-primary ring-4 ring-primary/20 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]" :
                        "bg-muted border-2 border-background"
                      )} aria-hidden="true">
                        {isPast && <Check size={12} strokeWidth={3} />}
                        {isActive && <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                      </div>
                      
                      {/* Teks Konten */}
                      <div className="flex flex-col -mt-1">
                        <span className={cn(
                          "text-sm font-bold", 
                          isFuture ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {STATUS_LABEL[step]}
                        </span>
                        {timestamp ? (
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {new Date(timestamp).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} WIB
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 mt-0.5 italic">Belum tersedia</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* --- 6. KARTU RINCIAN ITEM --- */}
        <Card className="shadow-sm border-border bg-background relative overflow-hidden">
          {/* Aksen gerigi seperti struk (opsional, via css border-top) */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle,transparent_2px,var(--background)_2px)] bg-[length:10px_10px]" />
          
          <CardHeader className="pb-3 pt-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShoppingBag size={16} className="text-muted-foreground" /> Rincian Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.items.map((item, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">{item.itemName}</span>
                  <Badge variant="secondary" className="font-semibold">x{item.qty}</Badge>
                </li>
              ))}
            </ul>

            {data.dueDate && (
              <div className="mt-5 pt-4 border-t border-dashed border-border flex items-start gap-2 text-sm text-primary font-medium bg-primary/5 -mx-6 px-6 pb-2">
                <CalendarClock size={16} className="mt-0.5 shrink-0" />
                <span>
                  Estimasi Selesai: <br/> 
                  <span className="font-bold text-foreground">
                    {new Date(data.dueDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}