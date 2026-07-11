// adminqinq/src/app/(app)/reports/advanced/page.tsx
import { cotebek } from '@/lib/cotebek';
import { FilterForm } from './FilterForm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Wallet, 
  ShoppingCart, 
  Receipt, 
  Medal, 
  CreditCard,
  Activity,
  TicketPercent,
  Minus,
  Calculator,
  PieChart
} from 'lucide-react';

type Summary = { revenue: number; cogs: number; grossProfit: number; totalOrders: number };
type TopItem = { itemName: string; totalSold: number };
type TrendPoint = { date: string; revenue: number; profit: number };
type PaymentMethodStat = { method: string; count: number; percentage: string };
type PromoBudget = { totalDiscount: number; ordersWithPromo: number; discountPercentage: string };
type NetProfit = { revenue: number; cogs: number; grossProfit: number; operatingExpense: number; netProfit: number };
type ExpenseByCategory = { category: string; total: number; count: number };

const CATEGORY_LABEL: Record<string, string> = {
  EXPENSE: 'Operasional',
  CAPEX: 'Aset/Modal',
  ADJUSTMENT: 'Penyesuaian',
  FUND_OUT: 'Modal Keluar',
  OTHER: 'Lainnya',
};

function last30DaysRangeWIB() {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);
  const start = new Date(nowWIB);
  start.setDate(start.getDate() - 29);
  return { start: start.toISOString().slice(0, 10), end };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function getChangeData(current: number, previous: number) {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${Math.abs(change).toFixed(1)}%`,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  };
}

function CompareBadge({ data }: { data: { value: string, trend: string } | null }) {
  if (!data) return <span className="text-[10px] text-muted-foreground ml-1">—</span>;
  
  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';

  return (
    <div className={cn(
      "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ml-1.5",
      isUp ? "bg-emerald-100 text-emerald-700" : 
      isDown ? "bg-destructive/10 text-destructive" : 
      "bg-muted text-muted-foreground"
    )}>
      {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : <Minus size={10} />}
      {data.value}
    </div>
  );
}

export default async function AdvancedReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const defaultRange = last30DaysRangeWIB();
  const startDate = params.startDate || defaultRange.start;
  const endDate = params.endDate || defaultRange.end;
  const compareStartDate = params.compareStartDate;
  const compareEndDate = params.compareEndDate;
  const hasCompare = !!(compareStartDate && compareEndDate);

  const qs = `?startDate=${startDate}&endDate=${endDate}`;

  const [summaryRes, topItemsRes, trendRes, paymentRes, promoRes, netProfitRes, expenseCategoryRes] = await Promise.all([
    cotebek<{ data: Summary }>(`/reports/summary${qs}`),
    cotebek<{ data: TopItem[] }>(`/reports/top-items${qs}`),
    cotebek<{ data: TrendPoint[] }>(`/reports/sales-trend${qs}`),
    cotebek<{ data: PaymentMethodStat[] }>(`/reports/payment-methods${qs}`),
    cotebek<{ data: PromoBudget }>(`/reports/promo-budget${qs}`),
    cotebek<{ data: NetProfit }>(`/reports/net-profit${qs}`),
    cotebek<{ data: ExpenseByCategory[] }>(`/reports/expense-by-category${qs}`),
  ]);

  let compareSummary: Summary | null = null;
  let comparePromo: PromoBudget | null = null;
  let compareNetProfit: NetProfit | null = null;

  if (hasCompare) {
    const compareQs = `?startDate=${compareStartDate}&endDate=${compareEndDate}`;
    const [cSummaryRes, cPromoRes, cNetProfitRes] = await Promise.all([
      cotebek<{ data: Summary }>(`/reports/summary${compareQs}`),
      cotebek<{ data: PromoBudget }>(`/reports/promo-budget${compareQs}`),
      cotebek<{ data: NetProfit }>(`/reports/net-profit${compareQs}`),
    ]);
    compareSummary = cSummaryRes.data;
    comparePromo = cPromoRes.data;
    compareNetProfit = cNetProfitRes.data;
  }

  const summary = summaryRes.data;
  const topItems = topItemsRes.data;
  const trend = trendRes.data;
  const payments = paymentRes.data;
  const promo = promoRes.data;
  const netProfit = netProfitRes.data;
  const expenseByCategory = expenseCategoryRes.data;
  
  const maxRevenue = Math.max(1, ...trend.map((t) => t.revenue));
  const maxExpense = Math.max(1, ...expenseByCategory.map((e) => e.total));

  return (
    <div className="p-4 pb-24 space-y-6">
      
      {/* 1. HEADER W/ BACK BUTTON */}
      <div className="flex items-center gap-3">
        <Link 
          href="/reports" 
          className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Kembali ke laporan utama"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            Laporan Lanjutan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Filter kustom & komparasi data</p>
        </div>
      </div>

      {/* 2. FILTER FORM COMPONENT */}
      <FilterForm 
        startDate={startDate} 
        endDate={endDate} 
        compareStartDate={compareStartDate} 
        compareEndDate={compareEndDate} 
      />

      {/* 3. SUMMARY CARDS W/ COMPARISON */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <TrendingUp size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Omzet</div>
            </div>
            <div className="flex items-baseline flex-wrap">
              <span className="text-lg font-bold text-emerald-700">Rp{summary.revenue.toLocaleString('id-ID')}</span>
              {hasCompare && compareSummary && <CompareBadge data={getChangeData(summary.revenue, compareSummary.revenue)} />}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-200 bg-blue-50/30">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Wallet size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Laba Kotor</div>
            </div>
            <div className="flex items-baseline flex-wrap">
              <span className="text-lg font-bold text-blue-700">Rp{summary.grossProfit.toLocaleString('id-ID')}</span>
              {hasCompare && compareSummary && <CompareBadge data={getChangeData(summary.grossProfit, compareSummary.grossProfit)} />}
            </div>
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

        <Card className="shadow-sm border-purple-200 bg-purple-50/30">
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-purple-600 mb-1">
              <Receipt size={14} />
              <div className="text-xs font-semibold uppercase tracking-wider">Total Order</div>
            </div>
            <div className="flex items-baseline flex-wrap">
              <span className="text-lg font-bold text-purple-700">{summary.totalOrders}</span>
              <span className="text-xs text-purple-700/70 ml-1 font-normal">nota</span>
              {hasCompare && compareSummary && <CompareBadge data={getChangeData(summary.totalOrders, compareSummary.totalOrders)} />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. LABA BERSIH (NET PROFIT STATEMENT) */}
      <Card className="shadow-sm border-border overflow-hidden">
        <CardHeader className="pb-3 pt-5 px-4 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Calculator size={16} className="text-blue-600" /> Ringkasan Laba Rugi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Omzet Penjualan</span>
            <span className="font-semibold text-foreground">Rp{netProfit.revenue.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-destructive">
            <span className="opacity-80">Modal (COGS)</span>
            <span className="font-medium">-Rp{netProfit.cogs.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm border-t border-dashed border-border pt-2 pb-1">
            <span className="font-medium text-foreground">Laba Kotor</span>
            <span className="font-bold text-foreground">Rp{netProfit.grossProfit.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-destructive">
            <span className="opacity-80">Beban Operasional</span>
            <span className="font-medium">-Rp{netProfit.operatingExpense.toLocaleString('id-ID')}</span>
          </div>

          <div className="flex justify-between items-center border-t-2 border-border pt-3 mt-2">
            <span className="font-bold text-base text-foreground uppercase tracking-wider text-[13px]">Laba Bersih</span>
            <div className="flex items-center gap-2">
              {hasCompare && compareNetProfit && (
                <CompareBadge data={getChangeData(netProfit.netProfit, compareNetProfit.netProfit)} />
              )}
              <span className={cn(
                "font-bold text-lg",
                netProfit.netProfit >= 0 ? "text-emerald-600" : "text-destructive"
              )}>
                Rp{netProfit.netProfit.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. BUDGET PROMO CARD */}
      <Card className="shadow-sm border-orange-200 bg-orange-50/30">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-700">
            <TicketPercent size={16} /> Budget Promo & Diskon
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-orange-200/50">
            <span className="text-sm font-medium text-orange-800/70">Total Diskon Diberikan</span>
            <span className="font-bold text-orange-700">Rp{promo.totalDiscount.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-orange-200/50">
            <span className="text-sm font-medium text-orange-800/70">Order Pakai Promo</span>
            <span className="font-bold text-orange-700">{promo.ordersWithPromo} <span className="font-normal text-xs opacity-70">nota</span></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-orange-800/70">Persentase dari Omzet</span>
            <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-100">{promo.discountPercentage}</Badge>
          </div>
          
          {hasCompare && comparePromo && (
            <div className="mt-4 p-3 bg-background/50 rounded-lg text-xs text-muted-foreground border border-orange-100">
              <span className="font-semibold block mb-1">Data Periode Pembanding:</span>
              Total Diskon: <span className="font-medium text-foreground">Rp{comparePromo.totalDiscount.toLocaleString('id-ID')}</span> 
              <br/>Digunakan di <span className="font-medium text-foreground">{comparePromo.ordersWithPromo} order</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. PENGELUARAN PER KATEGORI */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3 pt-5 px-4 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <PieChart size={16} className="text-rose-600" /> Pengeluaran Berdasarkan Kategori
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {expenseByCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada catatan pengeluaran.</p>
          ) : (
            <div className="space-y-3.5">
              {expenseByCategory.map((e) => {
                const percentage = (e.total / maxExpense) * 100;
                const catLabel = CATEGORY_LABEL[e.category] ?? e.category;
                
                return (
                  <div key={e.category} className="space-y-1.5">
                    <div className="flex justify-between items-end text-xs">
                      <span className="font-semibold text-foreground">{catLabel}</span>
                      <span className="font-bold text-rose-600">Rp{e.total.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex items-center">
                      <div 
                        className="bg-rose-500 h-full rounded-r-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.max(percentage, 1)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 7. TREN PENJUALAN HARIAN */}
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
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {trend.map((t) => {
                const percentage = (t.revenue / maxRevenue) * 100;
                return (
                  <div key={t.date} className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground w-12 shrink-0">{formatDate(t.date)}</span>
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

      {/* 8. LAYANAN TERLARIS */}
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

      {/* 9. METODE BAYAR */}
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