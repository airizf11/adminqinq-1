// adminqinq/src/app/devtest/apikeys/CreateAppForm.tsx
'use client';

import { useState } from 'react';
import { createApp } from './actions';

export function CreateAppForm() {
  const [name, setName] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    setPending(true);
    setError(null);
    const result = await createApp(name.trim());
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setName('');
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama usaha/app baru"
          className="flex-1 border rounded-lg p-2 text-sm"
        />
        <button onClick={handleSubmit} disabled={pending} className="bg-black text-white rounded-lg px-4 text-sm disabled:opacity-50">
          {pending ? '...' : 'Buat'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}