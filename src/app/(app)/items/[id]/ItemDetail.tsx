// adminqinq/src/app/(app)/items/[id]/ItemDetail.tsx
'use client';

import { useState } from 'react';
import { updateItem, toggleItemActive } from './actions';

type Item = { id: string; name: string; sku: string | null; price: number; cogs: number; category: string | null; isActive: boolean };

export function ItemDetail({ item }: { item: Item }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [isActive, setIsActive] = useState(item.isActive);
  const [togglePending, setTogglePending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const result = await updateItem(item.id, formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setSaved(true);
  }

  async function handleToggle() {
    const next = !isActive;
    setTogglePending(true);
    const result = await toggleItemActive(item.id, next);
    setTogglePending(false);
    if (result?.error) setError(result.error);
    else setIsActive(next);
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-3 flex justify-between items-center">
        <div>
          <div className="font-medium text-sm">Status Layanan</div>
          <div className="text-xs text-gray-500">
            {isActive ? 'Aktif — bisa dipilih di order baru' : 'Nonaktif — sementara gak muncul di order baru'}
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={togglePending}
          className={`w-12 h-7 rounded-full relative transition-colors ${isActive ? 'bg-green-600' : 'bg-gray-300'} disabled:opacity-50`}
        >
          <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nama layanan</label>
          <input name="name" required defaultValue={item.name} className="w-full border rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Harga (Rp)</label>
          <input name="price" type="number" min="0" required defaultValue={item.price} className="w-full border rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Kategori</label>
          <input name="category" defaultValue={item.category ?? ''} className="w-full border rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Modal / COGS</label>
          <input name="cogs" type="number" min="0" defaultValue={item.cogs} className="w-full border rounded-lg p-2.5" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && !error && <p className="text-sm text-green-600">Tersimpan.</p>}

        <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
          {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}