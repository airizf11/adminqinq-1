// adminqinq/src/app/(app)/customers/[id]/edit/page.tsx
import { cotebek } from '@/lib/cotebek';
import { EditForm } from './EditForm';

type CustomerDetail = {
  id: string; name: string; phone: string; email: string | null;
  gender: string | null; birthDate: string | null;
  addressDetail: string | null; village: string | null; district: string | null;
  city: string | null; province: string | null; postalCode: string | null;
  notes: string | null; tags: string[] | null;
};

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await cotebek<{ data: CustomerDetail }>(`/customers/${id}`);
  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-4">Edit Pelanggan</h1>
      <EditForm customer={res.data} />
    </div>
  );
}