// adminqinq/src/app/(app)/orders/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  finalAmount: number;
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: 'Diterima',
  IN_PROCESS: 'Diproses',
  READY: 'Siap Diambil',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export default async function OrdersPage() {
  const res = await cotebek<{ data: Order[] }>('/orders');
  const orders = res.data;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Order</h1>
        <Link href="/orders/new" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
          + Order Baru
        </Link>
      </div>

      {orders.length === 0 && <p className="text-sm text-gray-500">Belum ada order.</p>}

      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id}>
           <Link href={`/orders/${o.id}`} className="border rounded-lg p-3 flex justify-between items-center block active:bg-gray-50">
             <div>
               <div className="font-medium">{o.orderNumber}</div>
               <div className="text-xs text-gray-500">{STATUS_LABEL[o.status] ?? o.status}</div>
             </div>
             <div className="text-sm font-medium">Rp{o.finalAmount.toLocaleString('id-ID')}</div>
           </Link>
         </li>
        ))}
      </ul>
    </div>
  );
}