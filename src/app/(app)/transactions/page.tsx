// adminqinq/src/app/(app)/transactions/page.tsx
import { cotebek } from '@/lib/cotebek';
import Link from 'next/link';

type Transaction = {
  id: string;
  txNumber: string;
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
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

export default async function TransactionsPage() {
  const res = await cotebek<TransactionsResponse>('/transactions');
  // console.log(JSON.stringify(res, null, 2)); // Menggunakan JSON.stringify agar objek terlihat rapi dan lengkap di terminal

  // Ambil data dengan fallback (nilai cadangan) agar tidak crash jika undefined
  const { data } = res;
 const { summary } = res.meta;

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-4">Transaksi</h1>

      <div className="flex justify-end mb-3">
       <Link href="/transactions/new" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
         + Catat
       </Link>
     </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Masuk</div>
          <div className="text-sm font-semibold text-green-600">Rp{summary.totalIn.toLocaleString('id-ID')}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Keluar</div>
          <div className="text-sm font-semibold text-red-500">Rp{summary.totalOut.toLocaleString('id-ID')}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-gray-500">Saldo</div>
          <div className="text-sm font-semibold">Rp{summary.balance.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {data.length === 0 && <p className="text-sm text-gray-500">Belum ada transaksi.</p>}

      <ul className="space-y-2">
        {data.map((tx) => (
          <li key={tx.id} className="border rounded-lg p-3 flex justify-between items-center">
            <div>
              <div className="font-medium text-sm">{tx.description || CATEGORY_LABEL[tx.category] || tx.category}</div>
              <div className="text-xs text-gray-500">
                {tx.txNumber} · {new Date(tx.createdAt).toLocaleDateString('id-ID')}
              </div>
            </div>
            <div className={`text-sm font-semibold ${tx.type === 'IN' ? 'text-green-600' : 'text-red-500'}`}>
              {tx.type === 'IN' ? '+' : '-'}Rp{tx.amount.toLocaleString('id-ID')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}