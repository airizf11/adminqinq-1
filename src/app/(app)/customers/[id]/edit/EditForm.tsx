// adminqinq/src/app/(app)/customers/[id]/edit/EditForm.tsx
'use client';
import { useState } from 'react';
import { updateCustomer } from './actions';

type CustomerDetail = {
  id: string; name: string; phone: string; email: string | null;
  gender: string | null; birthDate: string | null;
  addressDetail: string | null; village: string | null; district: string | null;
  city: string | null; province: string | null; postalCode: string | null;
  notes: string | null; tags: string[] | null;
};

export function EditForm({ customer }: { customer: CustomerDetail }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await updateCustomer(customer.id, formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-600 block mb-1">Nama *</label>
        <input name="name" required defaultValue={customer.name} className="w-full border rounded-lg p-2.5" />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">No. HP</label>
        <input name="phone" defaultValue={customer.phone} className="w-full border rounded-lg p-2.5" />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Email</label>
        <input name="email" type="email" defaultValue={customer.email ?? ''} className="w-full border rounded-lg p-2.5" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Jenis Kelamin</label>
          <select name="gender" defaultValue={customer.gender ?? ''} className="w-full border rounded-lg p-2.5">
            <option value="">-</option>
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
            <option value="OTHER">Lainnya</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Tgl Lahir</label>
          <input name="birthDate" type="date" defaultValue={customer.birthDate ?? ''} className="w-full border rounded-lg p-2.5" />
        </div>
      </div>

      <hr className="border-gray-200" />
      <h2 className="text-sm font-medium text-gray-600">Alamat</h2>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Detail Alamat</label>
        <input name="addressDetail" defaultValue={customer.addressDetail ?? ''} className="w-full border rounded-lg p-2.5" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Desa/Kelurahan</label>
          <input name="village" defaultValue={customer.village ?? ''} className="w-full border rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Kecamatan</label>
          <input name="district" defaultValue={customer.district ?? ''} className="w-full border rounded-lg p-2.5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Kota/Kabupaten</label>
          <input name="city" defaultValue={customer.city ?? ''} className="w-full border rounded-lg p-2.5" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Provinsi</label>
          <input name="province" defaultValue={customer.province ?? ''} className="w-full border rounded-lg p-2.5" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Kode Pos</label>
        <input name="postalCode" defaultValue={customer.postalCode ?? ''} className="w-full border rounded-lg p-2.5" />
      </div>

      <hr className="border-gray-200" />

      <div>
        <label className="text-sm text-gray-600 block mb-1">Tags (pisah koma)</label>
        <input name="tags" defaultValue={customer.tags?.join(', ') ?? ''} className="w-full border rounded-lg p-2.5" />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Catatan</label>
        <textarea name="notes" rows={3} defaultValue={customer.notes ?? ''} className="w-full border rounded-lg p-2.5" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
        {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}