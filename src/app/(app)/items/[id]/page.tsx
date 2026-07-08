// adminqinq/src/app/(app)/items/[id]/page.tsx
import { cotebek } from '@/lib/cotebek';
import { ItemDetail } from './ItemDetail';

type Item = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  cogs: number;
  category: string | null;
  isActive: boolean };

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: Item }>(`/items/${id}`);
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Detail Layanan</h1>
      <ItemDetail item={res.data} />
    </div>
  );
}