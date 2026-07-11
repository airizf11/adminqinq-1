// adminqinq/src/app/(app)/customers/[id]/DeleteButton.tsx
'use client';

import { useState } from 'react';
import { deleteCustomer } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export function DeleteButton({ customerId, hasOrders }: { customerId: string; hasOrders: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setPending(true);
    setError(null);
    const result = await deleteCustomer(customerId);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  // Tampilan awal: Tombol Outline Merah
  if (!confirming) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setConfirming(true)} 
        className="w-full h-12 text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
      >
        <Trash2 size={18} className="mr-2" />
        Hapus Pelanggan
      </Button>
    );
  }

  // Tampilan konfirmasi: Kartu Danger Zone
  return (
    <Card className="border-destructive/40 bg-destructive/5 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      <CardContent className="p-4 space-y-4">
        
        <div className="flex items-start gap-3 text-destructive">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">
            {hasOrders 
              ? 'Pelanggan ini memiliki riwayat order. Penghapusan biasanya akan ditolak oleh sistem jika data ini masih terhubung dengan nota transaksi.' 
              : 'Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini permanen dan tidak dapat dibatalkan.'}
          </p>
        </div>

        {error && (
          <div className="text-xs font-semibold text-destructive bg-destructive/10 p-2.5 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button 
            variant="outline" 
            onClick={() => setConfirming(false)} 
            disabled={pending}
            className="flex-1 h-11 border-destructive/30 hover:bg-destructive/10 text-destructive cursor-pointer"
          >
            <X size={16} className="mr-1.5" /> Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={pending}
            className="flex-1 h-11 shadow-sm"
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin mr-1.5" />
            ) : (
              <Trash2 size={16} className="mr-1.5" />
            )}
            {pending ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}