// coteadmin/src/app/(app)/orders/[id]/OrderActionButtons.tsx
'use client';

import { useState } from 'react';
import { markOrderPaid, updateOrderStatus } from './actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Banknote, 
  Loader2, 
  CheckSquare,
  PackageCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildOrderUpdateMessage } from '@/lib/wa-templates';

// --- DATA & CONFIG ---
const PAYMENT_METHODS = ['Tunai', 'Transfer Bank', 'QRIS', 'E-Wallet'];

const TRANSITIONS: Record<string, { status: string; label: string; danger?: boolean; icon: any }[]> = {
  RECEIVED: [
    { status: 'IN_PROCESS', label: 'Mulai Proses', icon: Play },
    { status: 'CANCELLED', label: 'Batalkan Order', danger: true, icon: XCircle },
  ],
  IN_PROCESS: [
    { status: 'READY', label: 'Siap Diambil', icon: PackageCheck },
    { status: 'CANCELLED', label: 'Batalkan Order', danger: true, icon: XCircle },
  ],
  READY: [
    { status: 'DONE', label: 'Selesai / Sudah Diambil', icon: CheckCircle2 },
    { status: 'CANCELLED', label: 'Batalkan Order', danger: true, icon: XCircle },
  ],
  DONE: [],
  CANCELLED: [],
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: 'Diterima',
  IN_PROCESS: 'Diproses',
  READY: 'Siap Diambil',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

// --- HELPER FUNCTION ---
function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

// --- MAIN COMPONENT ---
type OrderActionButtonsProps = {
  orderId: string;
  currentStatus: string;
  paymentStatus: 'PAID' | 'UNPAID';
  defaultPaymentMethod: string;
  customerName: string | null;
  customerPhone: string | null;
  orderNumber: string;
  trackingToken: string | null;
  createdAt: string;
  statusHistory: { status: string | null; timestamp: string }[];
};

export function OrderActionButtons(props: OrderActionButtonsProps) {
  const [payMethod, setPayMethod] = useState(props.defaultPaymentMethod || PAYMENT_METHODS[0]);
  const [isPaying, setIsPaying] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // 1. Handler Mark Paid
  async function handleMarkPaid() {
    setIsPaying(true);
    const result = await markOrderPaid(props.orderId, payMethod);
    setIsPaying(false);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Order berhasil ditandai lunas!');
      setShowPayForm(false);
    }
  }

  // 2. Handler Change Status
  async function handleUpdateStatus(status: string) {
    setPendingStatus(status);
    const result = await updateOrderStatus(props.orderId, status);
    setPendingStatus(null);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status diubah ke ${STATUS_LABEL[status]}`);
    }
  }

  // 3. Generate WA Message
  const steps = [
    { label: STATUS_LABEL.RECEIVED, timestamp: props.createdAt },
    ...props.statusHistory
      .filter((h) => h.status && h.status !== 'RECEIVED')
      .map((h) => ({ label: STATUS_LABEL[h.status!] ?? h.status!, timestamp: h.timestamp })),
  ];
  
  const timelineText = steps
    .map((s) => `✓ ${s.label} - ${new Date(s.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`)
    .join('\n');

  const waMessage = buildOrderUpdateMessage({
   customerName: props.customerName,
   orderNumber: props.orderNumber,
   trackingToken: props.trackingToken,
   currentStatus: props.currentStatus,
   paymentStatus: props.paymentStatus,
   timelineText,
 });

  const statusOptions = TRANSITIONS[props.currentStatus] ?? [];

  return (
    <div className="space-y-3">
      
      {/* --- FORM MARK PAID --- */}
      {props.paymentStatus === 'UNPAID' && props.currentStatus !== 'CANCELLED' && (
        !showPayForm ? (
          <Button 
            variant="secondary" 
            className="w-full h-11 text-base shadow-sm cursor-pointer" 
            onClick={() => setShowPayForm(true)}
          >
            <Banknote size={18} className="mr-2" />
            Tandai Lunas
          </Button>
        ) : (
          <Card className="border-secondary/50 shadow-md">
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Pilih Metode Bayar
                </label>
                <select 
                  value={payMethod} 
                  onChange={(e) => setPayMethod(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPayForm(false)} disabled={isPaying}>
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleMarkPaid} disabled={isPaying}>
                  {isPaying ? <Loader2 size={16} className="animate-spin mr-1" /> : <CheckSquare size={16} className="mr-1" />}
                  {isPaying ? 'Menyimpan...' : 'Konfirmasi'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* --- STATUS ACTIONS --- */}
      {statusOptions.length > 0 && (
        <div className="grid gap-2">
          {statusOptions.map((opt) => {
  const Icon = opt.icon;
  const isThisPending = pendingStatus === opt.status;
  return (
    <Button
      key={opt.status}
      variant={opt.danger ? "destructive" : "default"}
      // Kita pastikan semua rata kiri dengan 'justify-start'
      className="w-full h-11 shadow-sm cursor-pointer" 
      disabled={pendingStatus !== null}
      onClick={() => handleUpdateStatus(opt.status)}
    >
      {isThisPending ? (
        <Loader2 size={18} className="animate-spin mr-2 opacity-70" />
      ) : (
        <Icon size={18} className="mr-2 opacity-70" />
      )}
      {isThisPending ? 'Memproses...' : opt.label}
    </Button>
  );
})}
        </div>
      )}

      {/* --- WHATSAPP BUTTON --- */}
      {props.customerPhone && (
  <a 
    href={waLink(props.customerPhone, waMessage)} 
    target="_blank" 
    rel="noopener noreferrer"
    // Tambahkan 'cursor-pointer' dan 'inline-flex' agar hover-nya terasa seperti link/tombol
    className={cn(
      buttonVariants({ variant: "default" }),
      "w-full h-11 bg-green-600 hover:bg-green-700 text-white shadow-sm cursor-pointer"
    )}
  >
    <MessageCircle size={18} className="mr-2" />
    Kirim Update via WhatsApp
  </a>
)}

      {/* Teks Bantuan jika Order sudah final */}
      {statusOptions.length === 0 && (
        <p className="text-xs text-center text-muted-foreground pt-2 pb-1 italic">
          Order ini telah {STATUS_LABEL[props.currentStatus]?.toLowerCase()} dan difinalisasi.
        </p>
      )}

    </div>
  );
}