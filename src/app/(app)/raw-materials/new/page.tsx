// adminqinq/src/app/(app)/raw-materials/new/page.tsx
'use client';

import { useState } from 'react';
import { createRawMaterial } from '../actions';

export default function NewRawMaterialPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createRawMaterial(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Tambah Bahan/Barang</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nama</label>
          <input name="name" required className="w-full border rounded-lg p-2.5" placeholder="LPG 12kg" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Satuan (opsional)</label>
          <input name="unit" className="w-full border rounded-lg p-2.5" placeholder="tabung, kg, liter, dll" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Kategori (opsional)</label>
          <input name="category" className="w-full border rounded-lg p-2.5" placeholder="Operasional" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}