// adminqinq/src/app/(app)/transactions/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { FilterForm } from './FilterForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ReceiptText, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-react';

type Transaction = {
  id: string;
  txNumber: string;
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
  fee: number | null;
  description: string | null;
  createdAt: string;
};

type TransactionsResponse = {
  data: Transaction[];
  meta: {
    summary: { totalIn: number; totalOut: number; balance: number };
  };
};

const CATEGORY_LABEL: Record<string, string> = {
  SALES: 'Penjualan',
  EXPENSE: 'Pengeluaran',
  FUND_IN: 'Modal Masuk',
  FUND_OUT: 'Modal Keluar',
  OTHER: 'Lainnya',
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string; type?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.startDate) qs.set('startDate', params.startDate);
  if (params.endDate) qs.set('endDate', params.endDate);
  if (params.type) qs.set('type', params.type);

  const res = await cotebek<TransactionsResponse>(`/transactions${qs.toString() ? `?${qs}` : ''}`);
  const { data } = res;
  const { summary } = res.meta;

  return (
    <div className="p-4 pb-24 space-y-5">
      
      {/* 1. HEADER & TOMBOL CATAT */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Transaksi</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau arus kas laundry-mu.</p>
        </div>
        <Link 
          href="/transactions/new" 
          className={cn(
            buttonVariants({ size: "sm" }), 
            "rounded-full shadow-md shrink-0 flex items-center gap-1 whitespace-nowrap"
          )}
        >
          <Plus size={16} aria-hidden="true" /> Catat
        </Link>
      </div>

      {/* 2. RINGKASAN SALDO (SUMMARY CARDS) */}
      <div className="grid grid-cols-3 gap-2" aria-label="Ringkasan Keuangan">
        {/* Pemasukan */}
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/10">
          <CardContent className="p-3 flex flex-col items-center text-center gap-1">
            <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600 mb-1" aria-hidden="true">
              <TrendingUp size={16} />
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Masuk</div>
            <div className="text-sm font-bold text-emerald-600 truncate w-full" title={`Rp${summary.totalIn.toLocaleString('id-ID')}`}>
              <span className="sr-only">Total Pemasukan: </span>
              Rp{summary.totalIn.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        {/* Pengeluaran */}
        <Card className="shadow-sm border-destructive/20 bg-destructive/5">
          <CardContent className="p-3 flex flex-col items-center text-center gap-1">
            <div className="p-1.5 bg-destructive/10 rounded-full text-destructive mb-1" aria-hidden="true">
              <TrendingDown size={16} />
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Keluar</div>
            <div className="text-sm font-bold text-destructive truncate w-full" title={`Rp${summary.totalOut.toLocaleString('id-ID')}`}>
              <span className="sr-only">Total Pengeluaran: </span>
              Rp{summary.totalOut.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-3 flex flex-col items-center text-center gap-1">
            <div className="p-1.5 bg-primary/10 rounded-full text-primary mb-1" aria-hidden="true">
              <Wallet size={16} />
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Saldo</div>
            <div className="text-sm font-bold text-primary truncate w-full" title={`Rp${summary.balance.toLocaleString('id-ID')}`}>
              <span className="sr-only">Sisa Saldo: </span>
              Rp{summary.balance.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. KOMPONEN FILTER TRANSAKSI */}
      <FilterForm startDate={params.startDate} endDate={params.endDate} type={params.type} />

      {/* 4. EMPTY STATE */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <ReceiptText className="text-muted-foreground opacity-50" size={32} aria-hidden="true" />
          </div>
          <p className="text-foreground font-medium">Tidak ada data</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
            Cobalah ubah filter tanggal atau jenis transaksi Anda.
          </p>
        </div>
      )}

      {/* 5. LIST TRANSAKSI */}
      <ul className="space-y-3" aria-label="Daftar Riwayat Transaksi">
        {data.map((tx) => {
          const isIncome = tx.type === 'IN';
          const catLabel = CATEGORY_LABEL[tx.category] || tx.category;

          return (
            <li key={tx.id}>
              <Card className="shadow-sm border-border hover:shadow-md transition-all duration-200">
                <CardContent className="p-3.5 flex justify-between items-start gap-3">
                  
                  {/* Bagian Kiri: Ikon & Detail Teks */}
                  <div className="flex items-start gap-3 overflow-hidden mt-0.5">
                    {/* Ikon Tipe Transaksi */}
                    <div 
                      className={cn(
                        "p-2.5 rounded-full shrink-0", 
                        isIncome ? "bg-emerald-100 text-emerald-600" : "bg-destructive/10 text-destructive"
                      )}
                      aria-hidden="true"
                    >
                      {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>

                    {/* Info Transaksi pakai Description List untuk Screen Reader */}
                    <dl className="flex flex-col overflow-hidden">
                      <dt className="sr-only">Keterangan</dt>
                      <dd className="font-semibold text-sm text-foreground truncate" title={tx.description || catLabel}>
                        {tx.description || catLabel}
                      </dd>
                      
                      <dt className="sr-only">Tanggal dan ID</dt>
                      <dd className="text-xs text-muted-foreground mt-0.5 truncate">
                        {tx.txNumber} &bull; {new Date(tx.createdAt).toLocaleString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WIB
                      </dd>
                    </dl>
                  </div>

                  {/* Bagian Kanan: Jumlah, Fee & Kategori */}
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <div 
                      className={cn(
                        "text-sm font-bold", 
                        isIncome ? "text-emerald-600" : "text-destructive"
                      )}
                    >
                      <span className="sr-only">{isIncome ? 'Pemasukan sebesar' : 'Pengeluaran sebesar'}</span>
                      {isIncome ? '+' : '-'}Rp{tx.amount.toLocaleString('id-ID')}
                    </div>

                    {/* Tampilan Fee Admin Opsional */}
                    {tx.fee != null && tx.fee > 0 && (
                      <div className="text-[10px] text-orange-500 font-medium mt-0.5" aria-label={`Dipotong biaya admin Rp${tx.fee}`}>
                        Fee: Rp{tx.fee.toLocaleString('id-ID')}
                      </div>
                    )}
                    
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 mt-1.5 text-muted-foreground shadow-none">
                      {catLabel}
                    </Badge>
                  </div>

                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

    </div>
  );
}