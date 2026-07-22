// adminqinq/src/app/(app)/transactions/[id]/page.tsx
import { cotebek } from '@/lib/cotebek';

type TxItem = { id: string; itemName: string; qty: number; unit: string | null; price: number; subtotal: number };
type TxDetail = {
  txNumber: string; type: 'IN' | 'OUT'; category: string; amount: number;
  fee: number | null; paymentMethod: string | null; description: string | null;
  paymentStatus: 'PAID' | 'UNPAID'; teamMemberName: string | null;
  createdAt: string; items: TxItem[];
};

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: TxDetail }>(`/transactions/${id}`);
  const tx = res.data;

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-1">{tx.txNumber}</h1>
      <p className="text-xs text-gray-500 mb-4">{new Date(tx.createdAt).toLocaleString('id-ID')}</p>

      <div className="border rounded-lg p-3 mb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Jumlah</span>
          <span className={tx.type === 'IN' ? 'text-green-600' : 'text-red-500'}>
            {tx.type === 'IN' ? '+' : '-'}Rp{tx.amount.toLocaleString('id-ID')}
          </span>
        </div>
        {tx.fee != null && tx.fee > 0 && (
          <div className="flex justify-between"><span className="text-gray-500">Fee</span><span>Rp{tx.fee.toLocaleString('id-ID')}</span></div>
        )}
        <div className="flex justify-between"><span className="text-gray-500">Status</span><span>{tx.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'}</span></div>
        {tx.teamMemberName && (
          <div className="flex justify-between"><span className="text-gray-500">Untuk</span><span>{tx.teamMemberName}</span></div>
        )}
      </div>

      {tx.items.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">Rincian</h2>
          <ul className="space-y-2">
            {tx.items.map((i) => (
              <li key={i.id} className="border rounded-lg p-3 flex justify-between items-center text-sm">
                <span>{i.itemName} x{i.qty}{i.unit ? ` ${i.unit}` : ''}</span>
                <span>Rp{i.subtotal.toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}