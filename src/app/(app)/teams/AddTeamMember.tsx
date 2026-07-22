// adminqinq/src/app/(app)/teams/AddTeamMemberForm.tsx
'use client';

import { useState } from 'react';
import { addTeamMember } from './actions';

export function AddTeamMemberForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    setPending(true);
    setError(null);
    const result = await addTeamMember(name.trim(), phone.trim() || undefined);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setName('');
      setPhone('');
    }
  }

  return (
    <div className="border rounded-lg p-3 mb-4 space-y-2">
      <label className="text-sm text-gray-600 block mb-1">Tambah Anggota (tanpa akun)</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" className="w-full border rounded-lg p-2.5 text-sm" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No. HP (opsional)" className="w-full border rounded-lg p-2.5 text-sm" />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button onClick={handleSubmit} disabled={pending} className="w-full bg-black text-white rounded-lg p-2.5 text-sm font-medium disabled:opacity-50">
        {pending ? 'Menambah...' : 'Tambah'}
      </button>
      <p className="text-xs text-gray-400">Cocok buat pekerja lapangan yang gak perlu login app, cuma buat dicatat namanya di Order/Transaksi.</p>
    </div>
  );
}