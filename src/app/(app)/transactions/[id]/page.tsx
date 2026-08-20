// adminqinq/src/app/(app)/transactions/[id]/page.tsx
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';

type TxItem = { id: string; itemName: string; qty: number; unit: string | null; price: number; subtotal: number };
type TxDetail = {
  txNumber: string; type: 'IN' | 'OUT'; category: string; amount: number;
  fee: number | null; paymentMethod: string | null; description: string | null;
  paymentStatus: 'PAID' | 'UNPAID'; teamMemberName: string | null;
  createdAt: string; items: TxItem[];
};

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: TxDetail }>(`/transactions/${id}`);
  const tx = res.data;

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold text-foreground mb-1">{tx.txNumber}</h1>
      <p className="text-xs text-muted-foreground mb-4">{new Date(tx.createdAt).toLocaleString('id-ID')}</p>

      <Card className="shadow-sm mb-4">
        <CardContent className="p-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jumlah</span>
            <span className={tx.type === 'IN' ? 'text-success' : 'text-destructive'}>
              {tx.type === 'IN' ? '+' : '-'}Rp{tx.amount.toLocaleString('id-ID')}
            </span>
          </div>
          {tx.fee != null && tx.fee > 0 && (
            <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="text-foreground">Rp{tx.fee.toLocaleString('id-ID')}</span></div>
          )}
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-foreground">{tx.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'}</span></div>
          {tx.teamMemberName && (
            <div className="flex justify-between"><span className="text-muted-foreground">Untuk</span><span className="text-foreground">{tx.teamMemberName}</span></div>
          )}
        </CardContent>
      </Card>

      {tx.items.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Rincian</h2>
          <ul className="space-y-2">
            {tx.items.map((i) => (
              <li key={i.id}>
                <Card className="shadow-sm">
                  <CardContent className="p-3 flex justify-between items-center text-sm">
                    <span className="text-foreground">{i.itemName} x{i.qty}{i.unit ? ` ${i.unit}` : ''}</span>
                    <span className="text-foreground">Rp{i.subtotal.toLocaleString('id-ID')}</span>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}