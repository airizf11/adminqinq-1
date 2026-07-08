// adminqinq/src/app/(app)/settings/SettingsForm.tsx
'use client';

import { useState } from 'react';
import { saveSettings } from './actions';

export function SettingsForm({ settings }: { settings: { order_prefix?: string; tx_prefix?: string;
   business_name?: string;
   business_address?: string;
   business_phone?: string;
   receipt_footer?: string; } }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const result = await saveSettings(formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setSaved(true);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-medium text-gray-600">Info Struk</h2>

      <div>
       <label className="text-sm text-gray-600 block mb-1">Nama Usaha</label>
       <input name="business_name" defaultValue={settings.business_name ?? ''} className="w-full border rounded-lg p-2.5" placeholder="Laundry Bersih Jaya" />
     </div>

     <div>
       <label className="text-sm text-gray-600 block mb-1">Alamat</label>
       <input name="business_address" defaultValue={settings.business_address ?? ''} className="w-full border rounded-lg p-2.5" />
     </div>

     <div>
       <label className="text-sm text-gray-600 block mb-1">No. Telepon</label>
       <input name="business_phone" defaultValue={settings.business_phone ?? ''} className="w-full border rounded-lg p-2.5" />
     </div>

     <div>
       <label className="text-sm text-gray-600 block mb-1">Footer Struk</label>
       <input name="receipt_footer" defaultValue={settings.receipt_footer ?? ''} className="w-full border rounded-lg p-2.5" placeholder="Terima kasih!" />
     </div>

     <hr className="border-gray-200" />
     <h2 className="text-sm font-medium text-gray-600">Format Nomor</h2>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Prefix Nomor Order</label>
        <input
          name="order_prefix"
          defaultValue={settings.order_prefix ?? 'ORD'}
          maxLength={10}
          className="w-full border rounded-lg p-2.5 uppercase"
          placeholder="ORD"
        />
        <p className="text-xs text-gray-400 mt-1">Contoh hasil: {settings.order_prefix ?? 'ORD'}-20260706-0001</p>
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Prefix Nomor Transaksi</label>
        <input
          name="tx_prefix"
          defaultValue={settings.tx_prefix ?? 'TRX'}
          maxLength={10}
          className="w-full border rounded-lg p-2.5 uppercase"
          placeholder="TRX"
        />
        <p className="text-xs text-gray-400 mt-1">Contoh hasil: {settings.tx_prefix ?? 'TRX'}-20260706-0001</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Tersimpan.</p>}

      <button type="submit" disabled={pending} className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50">
        {pending ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}