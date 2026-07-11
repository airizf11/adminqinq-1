// adminqinq/src/app/(app)/orders/new/page.tsx
import { cotebek } from '@/lib/cotebek';
import { OrderForm } from './OrderForm';

type Item = { id: string; name: string; price: number; cogs: number };
type Promo = { id: string; name: string; code: string | null; isActive: boolean; type: 'PERCENTAGE' | 'NOMINAL'; value: number };

export default async function NewOrderPage() {
  const [itemsRes, promosRes] = await Promise.all([
   cotebek<{ data: Item[] }>('/items'),
   cotebek<{ data: Promo[] }>('/promos'),
 ]);

 // Promo tanpa kode gak bisa dipakai lewat mekanisme checkout sekarang, jadi disaring
 const activePromos = promosRes.data.filter(
   (p): p is Promo & { code: string } => p.isActive && !!p.code,
 );

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Order Baru</h1>
      {itemsRes.data.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada layanan terdaftar. Tambah layanan dulu di menu Item.
        </p>
      ) : (
        <OrderForm items={itemsRes.data} promos={activePromos} />
      )}
    </div>
  );
}