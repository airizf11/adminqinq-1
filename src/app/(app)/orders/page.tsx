// adminqinq/src/app/(app)/orders/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { 
  Plus, 
  ChevronRight, 
  ReceiptText, 
  CircleDashed, 
  WashingMachine, 
  PackageCheck, 
  CheckCircle2, 
  Ban 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  finalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID';
};

// Konfigurasi Visual untuk setiap Status
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  RECEIVED: { 
    label: 'Diterima', 
    color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200', 
    icon: CircleDashed 
  },
  IN_PROCESS: { 
    label: 'Diproses', 
    // Menggunakan warna Navy (Primary) untuk order yang sedang dikerjakan
    color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20', 
    icon: WashingMachine 
  },
  READY: { 
    label: 'Siap Diambil', 
    // Menggunakan warna Emas (Secondary) agar mencolok dan segera diberikan ke pelanggan
    color: 'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30', 
    icon: PackageCheck 
  },
  DONE: { 
    label: 'Selesai', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200', 
    icon: CheckCircle2 
  },
  CANCELLED: { 
    label: 'Dibatalkan', 
    color: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20', 
    icon: Ban 
  },
};

export default async function OrdersPage() {
  const res = await cotebek<{ data: Order[] }>('/orders');
  const orders = res.data;

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-end">
  <div>
    <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Daftar Order</h1>
    <p className="text-sm text-muted-foreground mt-1">Kelola semua transaksi laundry.</p>
  </div>
        <Link 
    href="/orders/new" 
    className={cn(
      buttonVariants({ size: "sm" }), 
      "rounded-full shadow-md shrink-0 flex items-center gap-1 whitespace-nowrap"
    )}
  >
    <Plus size={16} /> Order Baru
  </Link>
      </div>

      {/* EMPTY STATE (Jika tidak ada order) */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <ReceiptText className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">Belum ada orderan</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
            Orderan baru yang diinput akan muncul di daftar ini.
          </p>
        </div>
      )}

      {/* LIST ORDER */}
      <div className="grid gap-3">
        {orders.map((o) => {
          const statusVisual = STATUS_CONFIG[o.status] || { 
            label: o.status, 
            color: 'bg-gray-100 text-gray-700 border-gray-200', 
            icon: ReceiptText 
          };
          const StatusIcon = statusVisual.icon;

          return (
            <Link 
              key={o.id} 
              href={`/orders/${o.id}`} 
              className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="shadow-sm border-border group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 flex flex-col gap-3">
                  
                  {/* Baris Atas: Nomer Order & Status Pembayaran */}
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-foreground tracking-wide">
                      {o.orderNumber}
                    </div>
                    {o.paymentStatus === 'UNPAID' ? (
                      <Badge variant="destructive" className="text-[10px] px-2 py-0.5 rounded-full shadow-none font-medium">
                        Belum Lunas
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full text-emerald-600 border-emerald-200 bg-emerald-50">
                        Lunas
                      </Badge>
                    )}
                  </div>

                  {/* Baris Bawah: Status Progress & Harga */}
                  <div className="flex justify-between items-end mt-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 font-medium transition-colors ${statusVisual.color}`}>
                        <StatusIcon size={14} />
                        {statusVisual.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-0.5">Total Biaya</div>
                        <div className="font-bold text-primary">
                          Rp{o.finalAmount.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground opacity-50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}