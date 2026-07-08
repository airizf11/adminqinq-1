// adminqinq/src/app/(app)/items/new/page.tsx
'use client';

import { useState } from 'react';
import { createItem } from '../actions';

export default function NewItemPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createItem(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Tambah Layanan</h1>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nama layanan</label>
          <input name="name" required className="w-full border rounded-lg p-2.5" placeholder="Cuci Kilat 3kg" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Harga (Rp)</label>
          <input name="price" type="number" min="0" required className="w-full border rounded-lg p-2.5" placeholder="15000" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Kategori (opsional)</label>
          <input name="category" className="w-full border rounded-lg p-2.5" placeholder="Cuci Kering" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Modal / COGS (opsional)</label>
          <input name="cogs" type="number" min="0" className="w-full border rounded-lg p-2.5" placeholder="5000" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50"
        >
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}