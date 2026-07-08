// adminqinq/src/app/(app)/promos/new/page.tsx
'use client';

import { useState } from 'react';
import { createPromo } from './actions';

export default function NewPromoPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createPromo(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-4">Buat Promo</h1>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nama Promo *</label>
          <input name="name" required className="w-full border rounded-lg p-2.5" placeholder="Diskon Kemerdekaan" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Kode (opsional)</label>
          <input name="code" className="w-full border rounded-lg p-2.5 uppercase" placeholder="MERDEKA17" />
          <p className="text-xs text-gray-400 mt-1">Kosongkan kalau diskon otomatis tanpa kode.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Jenis</label>
            <select name="type" required className="w-full border rounded-lg p-2.5">
              <option value="PERCENTAGE">Persentase (%)</option>
              <option value="NOMINAL">Nominal (Rp)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Nilai *</label>
            <input name="value" type="number" min="0" required className="w-full border rounded-lg p-2.5" placeholder="10" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Min. Belanja (Rp)</label>
            <input name="minOrder" type="number" min="0" className="w-full border rounded-lg p-2.5" placeholder="0" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Maks. Diskon (Rp)</label>
            <input name="maxDiscount" type="number" min="0" className="w-full border rounded-lg p-2.5" placeholder="Tanpa batas" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Limit Total Pakai</label>
            <input name="usageLimit" type="number" min="1" className="w-full border rounded-lg p-2.5" placeholder="Tanpa batas" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Limit / Pelanggan</label>
            <input name="maxUsagePerCustomer" type="number" min="1" className="w-full border rounded-lg p-2.5" placeholder="Tanpa batas" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Mulai</label>
            <input name="startDate" type="date" className="w-full border rounded-lg p-2.5" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Berakhir</label>
            <input name="endDate" type="date" className="w-full border rounded-lg p-2.5" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}