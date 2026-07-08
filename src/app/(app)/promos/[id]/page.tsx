// adminqinq/src/app/(app)/promos/[id]/page.tsx
import { cotebek } from '@/lib/cotebek';
import { PromoDetail } from './PromoDetail';

type Promo = {
  id: string; name: string; code: string | null;
  type: 'PERCENTAGE' | 'NOMINAL'; value: number;
  minOrder: number | null; maxDiscount: number | null;
  usageLimit: number | null; usageCount: number; maxUsagePerCustomer: number | null;
  isActive: boolean;
};

export default async function PromoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: Promo }>(`/promos/${id}`);
  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-4">Detail Promo</h1>
      <PromoDetail promo={res.data} />
    </div>
  );
}