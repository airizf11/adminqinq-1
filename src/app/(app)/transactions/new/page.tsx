// adminqinq/src/app/(app)/transactions/new/page.tsx
'use client';

import { useState } from 'react';
import { createTransaction } from '../actions';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  Tags, 
  AlignLeft, 
  Loader2, 
  Save,
  CalendarClock,
  Receipt
} from 'lucide-react';

const CATEGORIES = [
  { value: 'EXPENSE', label: 'Pengeluaran (Gaji, Opex, dll)' },
  { value: 'FUND_IN', label: 'Modal Masuk' },
  { value: 'FUND_OUT', label: 'Modal Keluar' },
  { value: 'OTHER', label: 'Lainnya' },
];

const PAYMENT_METHODS = ['Tunai', 'Transfer Bank', 'QRIS', 'E-Wallet'];

export default function NewTransactionPage() {
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createTransaction(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* 1. HEADER DENGAN TOMBOL BACK */}
      <div className="flex items-center gap-3">
        <Link 
          href="/transactions" 
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Kembali ke daftar transaksi"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            Catat Transaksi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Input pemasukan atau pengeluaran manual.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <Card className="shadow-sm border-border">
          <CardContent className="p-4 space-y-5">
            
            {/* 2. JENIS TRANSAKSI (SEGMENTED CONTROL) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Jenis Arus Kas</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={type === 'OUT' ? 'default' : 'outline'}
                  onClick={() => setType('OUT')}
                  className={type === 'OUT' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm h-11' : 'h-11 cursor-pointer'}
                >
                  <TrendingDown size={18} className="mr-2" />
                  Uang Keluar
                </Button>
                <Button
                  type="button"
                  variant={type === 'IN' ? 'default' : 'outline'}
                  onClick={() => setType('IN')}
                  className={type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-11' : 'h-11 cursor-pointer'}
                >
                  <TrendingUp size={18} className="mr-2" />
                  Uang Masuk
                </Button>
              </div>
              <input type="hidden" name="type" value={type} />
            </div>

            {/* 3. INPUT NOMINAL UTAMA (HERO INPUT) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Jumlah Nominal</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground pointer-events-none">
                  Rp
                </div>
                <Input 
                  name="amount" 
                  type="number" 
                  min="0" 
                  required 
                  className="pl-10 h-14 text-xl font-bold bg-background focus-visible:ring-primary/50" 
                  placeholder="0" 
                />
              </div>
            </div>

            <div className="h-px w-full bg-border" aria-hidden="true" />

            {/* 4. KATEGORI & METODE BAYAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Tags size={14} /> Kategori
                </Label>
                <select 
                  name="category" 
                  required 
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Wallet size={14} /> Metode Bayar
                </Label>
                <select 
                  name="paymentMethod" 
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. FEE ADMIN & TANGGAL WAKTU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Receipt size={14} /> Fee / Biaya Admin (Opsional)
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-muted-foreground pointer-events-none text-sm">
                    Rp
                  </div>
                  <Input 
                    name="fee" 
                    type="number" 
                    min="0"
                    className="pl-9 h-11 bg-background" 
                    placeholder="0" 
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Nominal di atas yang terpotong biaya admin (misal MDR QRIS).
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <CalendarClock size={14} /> Tanggal & Jam (Opsional)
                </Label>
                <Input 
                  name="transactionDate" 
                  type="datetime-local" 
                  className="h-11 bg-background" 
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Kosongkan jika ini adalah transaksi saat ini.
                </p>
              </div>
            </div>

            {/* 6. KETERANGAN CATATAN (FULL WIDTH) */}
            <div className="space-y-2 border-t border-dashed border-border pt-4">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <AlignLeft size={14} /> Keterangan Catatan
              </Label>
              <Input 
                name="description" 
                className="h-11 bg-background" 
                placeholder="Contoh: Beli deterjen cair 5L atau Bayar Tagihan Listrik" 
              />
            </div>

          </CardContent>
        </Card>

        {/* 7. ERROR & SUBMIT BUTTON */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-medium text-center">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={pending} 
          className="w-full h-12 text-base font-bold shadow-md cursor-pointer"
        >
          {pending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {pending ? 'Menyimpan Transaksi...' : 'Simpan Transaksi'}
        </Button>

      </form>
    </div>
  );
}