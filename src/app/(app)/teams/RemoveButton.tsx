// adminqinq/src/app/(app)/teams/RemoveButton.tsx
'use client';

import { useState } from 'react';
import { removeMember } from './actions';
import { Button } from '@/components/ui/button';

export function RemoveButton({ appId, userId }: { appId: string; userId: string }) {
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleRemove() {
    setPending(true);
    await removeMember(appId, userId);
    setPending(false);
  }

  if (!confirming) {
    return (
      <Button variant="link" size="sm" onClick={() => setConfirming(true)} className="h-auto p-0 text-xs text-destructive">
        Hapus
      </Button>
    );
  }

  return (
    <span className="text-xs flex items-center gap-2">
      <Button variant="link" size="sm" onClick={handleRemove} disabled={pending} className="h-auto p-0 text-xs text-destructive font-medium">
        {pending ? '...' : 'Ya'}
      </Button>
      <Button variant="link" size="sm" onClick={() => setConfirming(false)} className="h-auto p-0 text-xs text-muted-foreground">
        Batal
      </Button>
    </span>
  );
}