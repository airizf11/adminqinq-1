// adminqinq/src/app/(app)/promos/[id]/PromoDetail.tsx
'use client';

import { useState } from 'react';
import { updatePromo, togglePromoActive } from './actions';

type Promo = {
  id: string; name: string; code: string | null;
  type: 'PERCENTAGE' | 'NOMINAL'; value: number;
  minOrder: number | null; maxDiscount: number | null;
  usageLimit: number | null; usageCount: number; maxUsagePerCustomer: number | null;
  isActive: boolean;
};

export function PromoDetail({ promo }: { promo: Promo }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [isActive, setIsActive] = useState(promo.isActive);
  const [togglePending, setTogglePending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const result = await updatePromo(promo.id, formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setSaved(true);
  }

  async function handleToggle() {
    const next = !isActive;
    setTogglePending(true);
    const result = await togglePromoActive(promo.id, next);
    setTogglePending(false);
    if (result?.error) setError(result.error);
    else setIsActive(next);
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-3 flex justify-between items-center">
        <div>
          <div className="font-medium text-sm">Status Promo</div>
          <div className="text-xs text-gray-500">{isActive ? 'Aktif — bisa dipakai customer' : 'Nonaktif — gak bisa dipakai'}</div>
        </div>
        <button
          onClick={handleToggle}
          disabled={togglePending}
          className={`w-12 h-7 rounded-full relative transition-colors ${isActive ? 'bg-green-600' : 'bg-gray-300'} disabled:opacity-50`}
        >
          <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {promo.code && (
        <div className="border rounded-lg p-3 text-sm">
          <div className="text-gray-500 text-xs mb-1">Kode</div>
          <div className="font-mono font-medium">{promo.code}</div>
        </div>
      )}

      {promo.usageLimit && (
        <div className="border rounded-lg p-3 text-sm flex justify-between">
          <span className="text-gray-500">Pemakaian</span>
          <span className="font-medium">{promo.usageCount} / {promo.usageLimit}</span>
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nama Promo</label>
          <input name="name" required defaultValue={promo.name} className="w-full border rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nilai {promo.type === 'PERCENTAGE' ? '(%)' : '(Rp)'}</label>
          <input name="value" type="number" min="0" defaultValue={promo.value} className="w-full border rounded-lg p-2.5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Min. Belanja</label>
            <input name="minOrder" type="number" min="0" defaultValue={promo.minOrder ?? ''} className="w-full border rounded-lg p-2.5" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Maks. Diskon</label>
            <input name="maxDiscount" type="number" min="0" defaultValue={promo.maxDiscount ?? ''} className="w-full border rounded-lg p-2.5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Limit Total</label>
            <input name="usageLimit" type="number" min="1" defaultValue={promo.usageLimit ?? ''} className="w-full border rounded-lg p-2.5" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Limit / Pelanggan</label>
            <input name="maxUsagePerCustomer" type="number" min="1" defaultValue={promo.maxUsagePerCustomer ?? ''} className="w-full border rounded-lg p-2.5" />
          </div>
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