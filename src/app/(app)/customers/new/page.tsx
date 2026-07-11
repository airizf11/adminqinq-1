// adminqinq/src/app/(app)/customers/new/page.tsx
'use client';

import { useState } from 'react';
import { createCustomer } from '../actions';

export default function NewCustomerPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createCustomer(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-4">Tambah Pelanggan</h1>

      <form action={handleSubmit} className="space-y-4">
        {/* Data utama */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Nama *</label>
          <input name="name" required minLength={2} maxLength={100} className="w-full border rounded-lg p-2.5" placeholder="Cth: Budi Santoso" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">No. HP</label>
          <input name="phone" type="tel" className="w-full border rounded-lg p-2.5" placeholder="Cth: 08123456789" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Email</label>
          <input name="email" type="email" className="w-full border rounded-lg p-2.5" placeholder="Cth: budi@email.com" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Jenis Kelamin *</label>
            <select name="gender" className="w-full border rounded-lg p-2.5">
              <option value="">-</option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Tgl Lahir</label>
            <input name="birthDate" type="date" className="w-full border rounded-lg p-2.5" />
          </div>
        </div>

        {/* Alamat */}
        <hr className="border-gray-200" />
        <h2 className="text-sm font-medium text-gray-600">Alamat (opsional)</h2>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Detail Alamat</label>
          <input name="addressDetail" maxLength={255} className="w-full border rounded-lg p-2.5" placeholder="Cth: Jl. Merdeka No. 10, RT 02/RW 05" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Desa/Kelurahan</label>
            <input name="village" maxLength={100} className="w-full border rounded-lg p-2.5" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Kecamatan</label>
            <input name="district" maxLength={100} className="w-full border rounded-lg p-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Kota/Kabupaten</label>
            <input name="city" maxLength={100} className="w-full border rounded-lg p-2.5" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Provinsi</label>
            <input name="province" maxLength={100} className="w-full border rounded-lg p-2.5" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Kode Pos</label>
          <input name="postalCode" maxLength={5} pattern="\d{5}" className="w-full border rounded-lg p-2.5" placeholder="Cth: 68118" />
        </div>

        {/* Lainnya */}
        <hr className="border-gray-200" />

        <div>
          <label className="text-sm text-gray-600 block mb-1">Tags (pisah koma)</label>
          <input name="tags" className="w-full border rounded-lg p-2.5" placeholder="Cth: langganan, VIP" />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Catatan</label>
          <textarea name="notes" rows={3} className="w-full border rounded-lg p-2.5" placeholder="Cth: Suka minta pewangi ekstra" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
          {pending ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}