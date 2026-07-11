// adminqinq/src/app/(app)/customers/page.tsx
import Link from 'next/link';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { cotebek } from '@/lib/cotebek';

type Customer = { id: string; name: string; phone: string; city: string | null };

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `https://wa.me/${normalized}`;
}

export default async function CustomersPage() {
  const res = await cotebek<{ data: Customer[] }>('/customers');
  const customers = res.data;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Pelanggan</h1>
        <Link href="/customers/new" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
          + Tambah
        </Link>
      </div>

      {customers.length === 0 && <p className="text-sm text-gray-500">Belum ada pelanggan.</p>}

      <ul className="space-y-2">
        {customers.map((c) => (
          <li key={c.id} className="border rounded-lg flex items-center">
            <Link href={`/customers/${c.id}`} className="flex-1 p-3 flex items-center justify-between active:bg-gray-50">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.phone ?? 'Tanpa No. HP'}{c.city ? ` · ${c.city}` : ''}</div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
            {c.phone && (
            <a href={waLink(c.phone)} target="_blank" rel="noopener noreferrer" className="p-3 text-green-600" aria-label="Chat WhatsApp">
              <MessageCircle size={20} />
            </a>)}
          </li>
        ))}
      </ul>
    </div>
  );
}