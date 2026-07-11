// adminqinq/src/app/(app)/customers/[id]/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { DeleteButton } from './DeleteButton';

type OrderHistoryItem = { id: string; orderNumber: string; status: string; totalAmount: number };
type CustomerDetail = {
  id: string; name: string; phone: string; email: string | null;
  addressDetail: string | null; city: string | null; province: string | null;
  notes: string | null; orderHistory: OrderHistoryItem[];
};

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: 'Diterima', IN_PROCESS: 'Diproses', READY: 'Siap Diambil', DONE: 'Selesai', CANCELLED: 'Dibatalkan',
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: CustomerDetail }>(`/customers/${id}`);
  const c = res.data;

  return (
    <div className="p-4 pb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-semibold">{c.name}</h1>
          <p className="text-sm text-gray-500">{c.phone}</p>
        </div>
        <Link href={`/customers/${c.id}/edit`} className="text-sm border rounded-lg px-3 py-1.5">Edit</Link>
      </div>

      {(c.email || c.addressDetail || c.city) && (
        <div className="border rounded-lg p-3 mb-4 space-y-1 text-sm">
          {c.email && <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{c.email}</span></div>}
          {(c.addressDetail || c.city) && (
            <div className="flex justify-between">
              <span className="text-gray-500">Alamat</span>
              <span className="text-right">{[c.addressDetail, c.city, c.province].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {c.notes && (
        <div className="border rounded-lg p-3 mb-4 text-sm">
          <div className="text-gray-500 mb-1">Catatan</div>
          <div>{c.notes}</div>
        </div>
      )}

      <h2 className="text-sm font-medium text-gray-600 mb-2">Riwayat Order</h2>
      {c.orderHistory.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">Belum ada order.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {c.orderHistory.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="border rounded-lg p-3 flex justify-between items-center block">
                <div>
                  <div className="font-medium text-sm">{o.orderNumber}</div>
                  <div className="text-xs text-gray-500">{STATUS_LABEL[o.status] ?? o.status}</div>
                </div>
                <div className="text-sm font-medium">Rp{o.totalAmount.toLocaleString('id-ID')}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <DeleteButton customerId={c.id} hasOrders={c.orderHistory.length > 0} />
    </div>
  );
}