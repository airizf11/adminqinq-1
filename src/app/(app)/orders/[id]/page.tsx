// adminqinq/src/app/(app)/orders/[id]/page.tsx
import { cotebek } from '@/lib/cotebek';
import { StatusActions } from './StatusActions';
import Link from 'next/link';
import { WhatsAppUpdateButton } from './WhatsAppUpdateButton';

type OrderItem = { id: string; itemName: string; qty: number; subtotal: number };
type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
  customerName: string | null;
 customerPhone: string | null;
 handledByName: string | null;
 createdAt: string;
 promoCode: string | null;
 dueDate: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: 'Diterima',
  IN_PROCESS: 'Diproses',
  READY: 'Siap Diambil',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

type TrackingData = { statusHistory: { status: string | null; timestamp: string }[] };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: OrderDetail }>(`/orders/${id}`);
  const order = res.data;

  const trackRes = await cotebek<{ data: TrackingData }>(`/orders/track/${order.orderNumber}`);
 const statusHistory = trackRes.data.statusHistory;

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-1">{order.orderNumber}</h1>
      <span className="inline-block text-xs bg-gray-100 rounded-full px-3 py-1 mb-4">
        {STATUS_LABEL[order.status] ?? order.status}
      </span>

      <div className="border rounded-lg p-3 mb-4 space-y-1 text-sm">
       <div className="flex justify-between">
         <span className="text-gray-500">Customer</span>
         <span>{order.customerName ?? 'Walk-in / tanpa data'}</span>
       </div>
       {order.customerPhone && (
         <div className="flex justify-between">
           <span className="text-gray-500">No. HP</span>
           <span>{order.customerPhone}</span>
         </div>
       )}
       <div className="flex justify-between">
         <span className="text-gray-500">Ditangani</span>
         <span>{order.handledByName ?? '-'}</span>
       </div>
       {order.dueDate && (
         <div className="flex justify-between">
           <span className="text-gray-500">Estimasi Selesai</span>
           <span>{new Date(order.dueDate).toLocaleDateString('id-ID')}</span>
         </div>
       )}
     </div>

      <div className="border rounded-lg p-3 mb-4">
        <h2 className="text-sm font-medium text-gray-600 mb-2">Item</h2>
        <ul className="space-y-1">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between text-sm">
              <span>{i.itemName} x{i.qty}</span>
              <span>Rp{i.subtotal.toLocaleString('id-ID')}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border rounded-lg p-3 mb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>Rp{order.totalAmount.toLocaleString('id-ID')}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Diskon{order.promoCode ? ` (${order.promoCode})` : ''}</span>
            <span>-Rp{order.discountAmount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold border-t pt-1">
          <span>Total</span>
          <span>Rp{order.finalAmount.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-xs pt-1">
          <span>Metode Bayar</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>

      <StatusActions orderId={order.id} currentStatus={order.status} />

      <WhatsAppUpdateButton
       customerName={order.customerName}
       customerPhone={order.customerPhone}
       orderNumber={order.orderNumber}
       createdAt={order.createdAt}
       currentStatus={order.status}
       statusHistory={statusHistory}
     />

      <Link href={`/orders/${order.id}/receipt`} className="block text-center text-sm text-blue-600 mt-3">
+       Lihat / Cetak Struk
+     </Link>
    </div>
  );
}