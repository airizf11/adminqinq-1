// adminqinq/src/app/(app)/orders/[id]/StatusActions.tsx
'use client';

import { useState } from 'react';
import { updateOrderStatus } from './actions';

const TRANSITIONS: Record<string, { status: string; label: string; danger?: boolean }[]> = {
  RECEIVED: [
    { status: 'IN_PROCESS', label: 'Mulai Proses' },
    { status: 'CANCELLED', label: 'Batalkan', danger: true },
  ],
  IN_PROCESS: [
    { status: 'READY', label: 'Siap Diambil' },
    { status: 'CANCELLED', label: 'Batalkan', danger: true },
  ],
  READY: [
    { status: 'DONE', label: 'Selesai / Sudah Diambil' },
    { status: 'CANCELLED', label: 'Batalkan', danger: true },
  ],
  DONE: [],
  CANCELLED: [],
};

export function StatusActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const options = TRANSITIONS[currentStatus] ?? [];

  async function handleClick(status: string) {
    setPending(status);
    setError(null);
    const result = await updateOrderStatus(orderId, status);
    setPending(null);
    if (result?.error) setError(result.error);
  }

  if (options.length === 0) {
    return <p className="text-sm text-gray-400 text-center">Order sudah final, gak ada aksi lagi.</p>;
  }

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt.status}
          onClick={() => handleClick(opt.status)}
          disabled={pending !== null}
          className={`w-full rounded-lg p-3 font-medium disabled:opacity-50 ${
            opt.danger ? 'border border-red-500 text-red-500' : 'bg-black text-white'
          }`}
        >
          {pending === opt.status ? 'Memproses...' : opt.label}
        </button>
      ))}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}