// adminqinq/src/app/(app)/teams/InviteForm.tsx
'use client';

import { useState } from 'react';
import { inviteMember } from './actions';

export function InviteForm({ appId }: { appId: string }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    setPending(true);
    setError(null);
    setSuccess(null);
    const result = await inviteMember(appId, email.trim(), role);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess('Undangan terkirim.');
      setEmail('');
    }
  }

  return (
    <div className="border rounded-lg p-3 mb-4 space-y-2">
      <label className="text-sm text-gray-600 block mb-1">Undang Anggota Baru</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@gmail.com"
        className="w-full border rounded-lg p-2.5 text-sm"
      />
      <select value={role} onChange={(e) => setRole(e.target.value as 'STAFF' | 'ADMIN')} className="w-full border rounded-lg p-2.5 text-sm">
        <option value="STAFF">Staf</option>
        <option value="ADMIN">Admin</option>
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}
      <button onClick={handleSubmit} disabled={pending} className="w-full bg-black text-white rounded-lg p-2.5 text-sm font-medium disabled:opacity-50">
        {pending ? 'Mengirim...' : 'Kirim Undangan'}
      </button>
    </div>
  );
}