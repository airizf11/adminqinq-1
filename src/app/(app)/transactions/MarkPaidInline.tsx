// adminqinq/src/app/(app)/transactions/MarkPaidInline.tsx
'use client';

import { useState } from 'react';
import { markTransactionPaid } from './actions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function MarkPaidInline({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await markTransactionPaid(id);
    } catch (error) {
      console.error('Gagal menandai lunas:', error);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      disabled={pending} 
      variant="outline"
      size="sm"
      className="h-5 px-1.5 py-0 text-[9px] font-semibold border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 transition-colors shadow-none shrink-0 cursor-pointer"
      title="Tandai sebagai Lunas"
    >
      {pending ? (
        <Loader2 size={10} className="animate-spin mr-1" />
      ) : (
        <CheckCircle2 size={10} className="mr-1 text-orange-600" />
      )}
      {pending ? 'Proses...' : 'Lunasi'}
    </Button>
  );
}