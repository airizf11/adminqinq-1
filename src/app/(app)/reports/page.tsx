// adminqinq/src/app/(app)/reports/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';

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
  const maxRevenue = Math.max(1, ...trend.map((t) => t.revenue));

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-1">Laporan</h1>
      <p className="text-xs text-gray-500 mb-4">30 hari terakhir ({start} s/d {end})</p>

      <Link href="/reports/advanced" className="text-sm text-blue-600 mb-4 inline-block">
+       Lihat laporan lebih detail (filter tanggal, compare periode) →
+     </Link>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Omzet</div>
          <div className="text-base font-semibold text-green-600">Rp{summary.revenue.toLocaleString('id-ID')}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Laba Kotor</div>
          <div className="text-base font-semibold">Rp{summary.grossProfit.toLocaleString('id-ID')}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Modal (COGS)</div>
          <div className="text-base font-semibold text-gray-600">Rp{summary.cogs.toLocaleString('id-ID')}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Total Order</div>
          <div className="text-base font-semibold">{summary.totalOrders}</div>
        </div>
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