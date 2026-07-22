// adminqinq/src/app/(app)/reports/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  ShoppingCart, 
  Receipt, 
  ArrowRight, 
  Medal, 
  CreditCard,
  Activity,
  CalendarDays
} from 'lucide-react';

type Summary = { revenue: number; cogs: number; grossProfit: number; totalOrders: number };
type TopItem = { itemName: string; totalSold: number };
type TrendPoint = { date: string; revenue: number; profit: number };
type PaymentMethodStat = { method: string; count: number; percentage: string };

function last30DaysRangeWIB() {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);
  const startDate = new Date(nowWIB);
  startDate.setDate(startDate.getDate() - 29);
  const start = startDate.toISOString().slice(0, 10);
  return { start, end };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default async function ReportsPage() {
  const { start, end } = last30DaysRangeWIB();
  const qs = `?startDate=${start}&endDate=${end}`;

  const [summaryRes, topItemsRes, trendRes, paymentRes] = await Promise.all([
    cotebek<{ data: Summary }>(`/reports/summary${qs}`),
    cotebek<{ data: TopItem[] }>(`/reports/top-items${qs}`),
    cotebek<{ data: TrendPoint[] }>(`/reports/sales-trend${qs}`),
    cotebek<{ data: PaymentMethodStat[] }>(`/reports/payment-methods${qs}`),
  ]);

  const summary = summaryRes.data;
  const topItems = topItemsRes.data;
  const trend = trendRes.data;
  const payments = paymentRes.data;
  
  // Ambil nilai tertinggi untuk mentransformasi grafik CSS
  const maxRevenue = Math.max(1, ...trend.map((t) => t.revenue));

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* 1. HEADER & PERIODE */}
      <div className="mb-2">
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Laporan Keuangan</h1>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
          <CalendarDays size={14} />
          <span>30 Hari Terakhir ({formatDate(start)} - {formatDate(end)})</span>
        </div>
      </div>

      {/* 2. ADVANCED REPORTS BANNER */}
      <Link href="/reports/advanced" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg" aria-hidden="true">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="font-bold text-primary text-sm">Laporan Mendalam</div>
                <div className="text-xs text-muted-foreground mt-0.5">Filter tanggal & komparasi periode</div>
              </div>
            </div>
            <ArrowRight size={18} className="text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </CardContent>
        </Card>
      </Link>

      {/* 3. SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/10">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <TrendingUp size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Omzet</div>
            </div>
            <div className="text-lg font-bold text-emerald-700">Rp{summary.revenue.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-200 bg-blue-50/10">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Wallet size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Laba Kotor</div>
            </div>
            <div className="text-lg font-bold text-blue-700">Rp{summary.grossProfit.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-muted/10">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <ShoppingCart size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Modal (COGS)</div>
            </div>
            <div className="text-lg font-bold text-foreground">Rp{summary.cogs.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-purple-200 bg-purple-50/10">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-purple-600 mb-1">
              <Receipt size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Total Order</div>
            </div>
            <div className="text-lg font-bold text-purple-700">{summary.totalOrders} <span className="text-xs font-normal opacity-70">nota</span></div>
          </CardContent>
        </Card>
      </div>

      {/* 4. TREN PENJUALAN HARIAN */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3 pt-5 px-4 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity size={16} className="text-emerald-600" /> Tren Penjualan Harian
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {trend.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada data tren penjualan.</p>
          ) : (
            <div className="space-y-3">
              {trend.map((t) => {
                const percentage = (t.revenue / maxRevenue) * 100;
                return (
                  <div key={t.date} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-12 shrink-0">{formatDate(t.date)}</span>
                    <div className="flex-1 bg-muted rounded-full h-5 relative overflow-hidden flex items-center">
                      <div 
                        className="bg-emerald-500 h-full rounded-r-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.max(percentage, 2)}%` }} 
                      />
                    </div>
                    <span className="text-xs font-bold w-[75px] text-right shrink-0">
                      {t.revenue > 0 ? `Rp${(t.revenue / 1000).toLocaleString('id-ID')}k` : '0'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. LAYANAN TERLARIS */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3 pt-5 px-4 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Medal size={16} className="text-amber-500" /> Layanan Terlaris
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {topItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Belum ada data layanan.</p>
          ) : (
            <ul className="divide-y divide-border">
              {topItems.map((item, i) => (
                <li key={item.itemName} className="flex justify-between items-center p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      i === 0 ? "bg-amber-100 text-amber-700" : 
                      i === 1 ? "bg-slate-100 text-slate-700" : 
                      i === 2 ? "bg-orange-100 text-orange-800" : 
                      "bg-muted text-muted-foreground"
                    )}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{item.itemName}</span>
                  </div>
                  <span className="text-sm font-bold bg-muted px-2 py-1 rounded-md">{item.totalSold}x</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 6. METODE BAYAR */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3 pt-5 px-4 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CreditCard size={16} className="text-blue-600" /> Metode Bayar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada data pembayaran.</p>
          ) : (
            <ul className="space-y-4">
              {payments.map((p) => {
                const pctValue = parseFloat(p.percentage);
                return (
                  <li key={p.method} className="relative">
                    <div className="flex justify-between items-end mb-1.5 relative z-10">
                      <span className="text-sm font-medium">{p.method}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold">{p.percentage}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">({p.count}x)</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar di bawah teks */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pctValue}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
}