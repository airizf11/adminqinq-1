// adminqinq/src/app/(app)/transactions/new/page.tsx
'use client';

import { useState } from 'react';
import { createTransaction } from '../actions';

const CATEGORIES = [
  { value: 'EXPENSE', label: 'Pengeluaran (Gaji, Opex, dll)' },
  { value: 'FUND_IN', label: 'Modal Masuk' },
  { value: 'FUND_OUT', label: 'Modal Keluar' },
  { value: 'OTHER', label: 'Lainnya' },
];

const PAYMENT_METHODS = ['Tunai', 'Transfer Bank', 'QRIS', 'E-Wallet'];

export default function NewTransactionPage() {
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createTransaction(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Catat Transaksi</h1>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Jenis</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('OUT')}
              className={`border rounded-lg p-2.5 text-sm font-medium ${type === 'OUT' ? 'bg-red-500 text-white border-red-500' : ''}`}
            >
              Keluar
            </button>
            <button
              type="button"
              onClick={() => setType('IN')}
              className={`border rounded-lg p-2.5 text-sm font-medium ${type === 'IN' ? 'bg-green-600 text-white border-green-600' : ''}`}
            >
              Masuk
            </button>
          </div>
          <input type="hidden" name="type" value={type} />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Kategori</label>
          <select name="category" required className="w-full border rounded-lg p-2.5">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Jumlah (Rp)</label>
          <input name="amount" type="number" min="0" required className="w-full border rounded-lg p-2.5" placeholder="500000" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Metode Bayar</label>
          <select name="paymentMethod" className="w-full border rounded-lg p-2.5">
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Keterangan</label>
          <input name="description" className="w-full border rounded-lg p-2.5" placeholder="Gaji karyawan Juli" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}