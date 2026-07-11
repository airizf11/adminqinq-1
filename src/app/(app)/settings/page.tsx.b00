// adminqinq/src/app/(app)/settings/page.tsx
import { cotebek } from '@/lib/cotebek';
import { SettingsForm } from './SettingsForm';

type Settings = { order_prefix?: string; tx_prefix?: string;
 business_name?: string;
 business_address?: string;
 business_phone?: string;
 receipt_footer?: string; };

export default async function SettingsPage() {
  const res = await cotebek<{ data: Settings }>('/app-settings');
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Pengaturan Usaha</h1>
      <SettingsForm settings={res.data} />
    </div>
  );
}