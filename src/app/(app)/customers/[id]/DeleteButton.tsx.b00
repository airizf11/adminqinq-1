// adminqinq/src/app/(app)/customers/[id]/DeleteButton.tsx
'use client';

import { useState } from 'react';
import { deleteCustomer } from '../actions';

export function DeleteButton({ customerId, hasOrders }: { customerId: string; hasOrders: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setPending(true);
    setError(null);
    const result = await deleteCustomer(customerId);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="w-full border border-red-500 text-red-500 rounded-lg p-3 text-sm">
        Hapus Pelanggan
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-center text-gray-600">
        {hasOrders ? 'Pelanggan ini punya riwayat order — kemungkinan gak bisa dihapus.' : 'Yakin hapus pelanggan ini? Gak bisa dibatalkan.'}
      </p>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <div className="flex gap-2">
        <button onClick={() => setConfirming(false)} className="flex-1 border rounded-lg p-2 text-sm">Batal</button>
        <button onClick={handleDelete} disabled={pending} className="flex-1 bg-red-500 text-white rounded-lg p-2 text-sm disabled:opacity-50">
          {pending ? 'Menghapus...' : 'Ya, Hapus'}
        </button>
      </div>
    </div>
  );
}