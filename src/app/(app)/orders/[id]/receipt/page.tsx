// adminqinq/src/app/(app)/orders/[id]/receipt/page.tsx
import { cotebek } from '@/lib/cotebek';
import { PrintButton } from './PrintButton';

type ReceiptData = {
  business: { name: string; address: string | null; phone: string | null; footer: string };
  order: { orderNumber: string; paymentMethod: string; createdAt: string; paymentStatus: 'PAID' | 'UNPAID' };
  customer: { name: string | null };
  items: { itemName: string; qty: number; price: number; subtotal: number }[];
  summary: { subtotal: number; discountAmount: number; promoName: string | null; total: number };
};

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: ReceiptData }>(`/orders/${id}/receipt`);
  const r = res.data;

  return (
    <div className="p-4">
      <PrintButton />

      <style>{`@page { size: 58mm auto; margin: 2mm; }`}</style>

      <div className="max-w-[320px] print:max-w-[200px] mx-auto font-mono text-[11px] print:text-[10px] bg-white p-4 border rounded-lg print:border-0 print:shadow-none print:p-0">
        <div className="text-center mb-3">
          <div className="font-bold text-sm">{r.business.name}</div>
          {r.business.address && <div>{r.business.address}</div>}
          {r.business.phone && <div>{r.business.phone}</div>}
        </div>

        <div className="border-t border-dashed border-black py-2 space-y-0.5">
          <div className="flex justify-between"><span>No. Order</span><span>{r.order.orderNumber}</span></div>
          <div className="flex justify-between"><span>Tanggal</span><span>{new Date(r.order.createdAt).toLocaleString('id-ID')}</span></div>
          {r.customer.name && <div className="flex justify-between"><span>Customer</span><span>{r.customer.name}</span></div>}
        </div>

        <div className="border-t border-dashed border-black py-2 space-y-1">
          {r.items.map((item, i) => (
            <div key={i}>
              <div>{item.itemName}</div>
              <div className="flex justify-between text-gray-600">
                <span>{item.qty} x Rp{item.price.toLocaleString('id-ID')}</span>
                <span>Rp{item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black py-2 space-y-0.5">
          <div className="flex justify-between"><span>Subtotal</span><span>Rp{r.summary.subtotal.toLocaleString('id-ID')}</span></div>
          {r.summary.discountAmount > 0 && (
            <div className="flex justify-between">
              <span>Diskon{r.summary.promoName ? ` (${r.summary.promoName})` : ''}</span>
              <span>-Rp{r.summary.discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-black pt-1 mt-1">
            <span>Total</span><span>Rp{r.summary.total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between"><span>Bayar</span><span>{r.order.paymentMethod}</span></div>

          <div className="flex justify-between font-bold">
           <span>Status</span>
           <span>{r.order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}</span>
         </div>
        </div>

        <div className="border-t border-dashed border-black pt-2 text-center">{r.business.footer}</div>
      </div>
    </div>
  );
}