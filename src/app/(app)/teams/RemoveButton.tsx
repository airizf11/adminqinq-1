// adminqinq/src/app/(app)/teams/RemoveButton.tsx
'use client';

import { useState } from 'react';
import { removeMember } from './actions';

export function RemoveButton({ appId, userId }: { appId: string; userId: string }) {
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleRemove() {
    setPending(true);
    await removeMember(appId, userId);
    setPending(false);
  }

  if (!confirming) {
    return <button onClick={() => setConfirming(true)} className="text-xs text-red-500">Hapus</button>;
  }

  return (
    <span className="text-xs">
      <button onClick={handleRemove} disabled={pending} className="text-red-600 font-medium mr-2">
        {pending ? '...' : 'Ya'}
      </button>
      <button onClick={() => setConfirming(false)} className="text-gray-400">Batal</button>
    </span>
  );
}