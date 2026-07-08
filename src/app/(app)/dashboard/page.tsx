// adminqinq/src/app/(app)/dashboard/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';

type Overview = {
  ordersToday: number;
  revenueToday: number;
  activeOrders: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
};

export default async function DashboardPage() {
  const res = await cotebek<{ data: Overview }>('/reports/overview');
  const o = res.data;

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-4">Ringkasan</h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Order Hari Ini</div>
          <div className="text-xl font-bold">{o.ordersToday}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Omzet Hari Ini</div>
          <div className="text-base font-semibold text-green-600">Rp{o.revenueToday.toLocaleString('id-ID')}</div>
        </div>
      </div>

      <Link href="/orders" className="border rounded-lg p-3 flex justify-between items-center mb-4">
        <div>
          <div className="font-medium text-sm">Order Berjalan</div>
          <div className="text-xs text-gray-500">Belum selesai</div>
        </div>
        <div className="text-xl font-bold">{o.activeOrders}</div>
      </Link>

      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Total Order</div>
          <div className="text-base font-semibold">{o.totalOrders}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Total Pelanggan</div>
          <div className="text-base font-semibold">{o.totalCustomers}</div>
        </div>
      </div>
    </div>
  );
}