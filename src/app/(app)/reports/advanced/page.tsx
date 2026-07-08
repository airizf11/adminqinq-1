// adminqinq/src/app/(app)/reports/advanced/page.tsx
import { cotebek } from '@/lib/cotebek';
import { FilterForm } from './FilterForm';

type Summary = { revenue: number; cogs: number; grossProfit: number; totalOrders: number };
type TopItem = { itemName: string; totalSold: number };
type TrendPoint = { date: string; revenue: number; profit: number };
type PaymentMethodStat = { method: string; count: number; percentage: string };
type PromoBudget = { totalDiscount: number; ordersWithPromo: number; discountPercentage: string };

function last30DaysRangeWIB() {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(Date.now() + WIB_OFFSET_MS);
  const end = nowWIB.toISOString().slice(0, 10);
  const start = new Date(nowWIB);
  start.setDate(start.getDate() - 29);
  return { start: start.toISOString().slice(0, 10), end };
}

function percentChange(current: number, previous: number): string | null {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
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

  const [summaryRes, topItemsRes, trendRes, paymentRes, promoRes] = await Promise.all([
    cotebek<{ data: Summary }>(`/reports/summary${qs}`),
    cotebek<{ data: TopItem[] }>(`/reports/top-items${qs}`),
    cotebek<{ data: TrendPoint[] }>(`/reports/sales-trend${qs}`),
    cotebek<{ data: PaymentMethodStat[] }>(`/reports/payment-methods${qs}`),
    cotebek<{ data: PromoBudget }>(`/reports/promo-budget${qs}`),
  ]);

  let compareSummary: Summary | null = null;
  let comparePromo: PromoBudget | null = null;

  if (hasCompare) {
    const compareQs = `?startDate=${compareStartDate}&endDate=${compareEndDate}`;
    const [cSummaryRes, cPromoRes] = await Promise.all([
      cotebek<{ data: Summary }>(`/reports/summary${compareQs}`),
      cotebek<{ data: PromoBudget }>(`/reports/promo-budget${compareQs}`),
    ]);
    compareSummary = cSummaryRes.data;
    comparePromo = cPromoRes.data;
  }

  const summary = summaryRes.data;
  const topItems = topItemsRes.data;
  const trend = trendRes.data;
  const payments = paymentRes.data;
  const promo = promoRes.data;
  const maxRevenue = Math.max(1, ...trend.map((t) => t.revenue));

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-1">Laporan Lanjutan</h1>
      <p className="text-xs text-gray-500 mb-4">{startDate} s/d {endDate}</p>

      <FilterForm startDate={startDate} endDate={endDate} compareStartDate={compareStartDate} compareEndDate={compareEndDate} />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Omzet</div>
          <div className="text-base font-semibold text-green-600">Rp{summary.revenue.toLocaleString('id-ID')}</div>
          {hasCompare && compareSummary && (
            <div className="text-xs text-gray-400 mt-1">{percentChange(summary.revenue, compareSummary.revenue) ?? '—'} vs pembanding</div>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Laba Kotor</div>
          <div className="text-base font-semibold">Rp{summary.grossProfit.toLocaleString('id-ID')}</div>
          {hasCompare && compareSummary && (
            <div className="text-xs text-gray-400 mt-1">{percentChange(summary.grossProfit, compareSummary.grossProfit) ?? '—'} vs pembanding</div>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Modal (COGS)</div>
          <div className="text-base font-semibold text-gray-600">Rp{summary.cogs.toLocaleString('id-ID')}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Total Order</div>
          <div className="text-base font-semibold">{summary.totalOrders}</div>
          {hasCompare && compareSummary && (
            <div className="text-xs text-gray-400 mt-1">{percentChange(summary.totalOrders, compareSummary.totalOrders) ?? '—'} vs pembanding</div>
          )}
        </div>
      </div>

      <h2 className="text-sm font-medium text-gray-600 mb-2">Budget Promo</h2>
      <div className="border rounded-lg p-3 mb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Diskon Diberikan</span>
          <span className="font-medium">Rp{promo.totalDiscount.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Order Pakai Promo</span>
          <span className="font-medium">{promo.ordersWithPromo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">% dari Omzet Kotor</span>
          <span className="font-medium">{promo.discountPercentage}</span>
        </div>
        {hasCompare && comparePromo && (
          <div className="text-xs text-gray-400 pt-1 border-t mt-1">
            Periode pembanding: Rp{comparePromo.totalDiscount.toLocaleString('id-ID')} ({comparePromo.ordersWithPromo} order)
          </div>
        )}
      </div>

      <h2 className="text-sm font-medium text-gray-600 mb-2">Tren Penjualan Harian</h2>
      {trend.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">Belum ada data.</p>
      ) : (
        <div className="border rounded-lg p-3 mb-4 space-y-1.5">
          {trend.map((t) => (
            <div key={t.date} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20 shrink-0">{t.date.slice(5)}</span>
              <div className="flex-1 bg-gray-100 rounded h-4 relative overflow-hidden">
                <div className="bg-green-600 h-full rounded" style={{ width: `${(t.revenue / maxRevenue) * 100}%` }} />
              </div>
              <span className="text-xs font-medium w-20 text-right shrink-0">Rp{t.revenue.toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-sm font-medium text-gray-600 mb-2">Layanan Terlaris</h2>
      {topItems.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">Belum ada data.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {topItems.map((item, i) => (
            <li key={item.itemName} className="border rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm">{i + 1}. {item.itemName}</span>
              <span className="text-sm font-medium">{item.totalSold}x</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-sm font-medium text-gray-600 mb-2">Metode Bayar</h2>
      {payments.length === 0 ? (
        <p className="text-sm text-gray-400">Belum ada data.</p>
      ) : (
        <ul className="space-y-2">
          {payments.map((p) => (
            <li key={p.method} className="border rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm">{p.method}</span>
              <span className="text-sm text-gray-500">{p.count}x · {p.percentage}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}