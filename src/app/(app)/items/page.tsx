// adminqinq/src/app/(app)/items/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';

type Item = { id: string; name: string; sku: string | null; price: number; category: string | null; isActive: boolean };

export default async function ItemsPage() {
  const res = await cotebek<{ data: Item[] }>('/items?includeInactive=true');
  const items = res.data;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Daftar Layanan</h1>
        <Link href="/items/new" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
          + Tambah
        </Link>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">Belum ada layanan. Tambah dulu yuk.</p>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
           <Link
             href={`/items/${item.id}`}
             className={`border rounded-lg p-3 flex justify-between items-center block active:bg-gray-50 ${!item.isActive ? 'opacity-50' : ''}`}
           >
             <div>
               <div className="font-medium flex items-center gap-2">
                 {item.name}
                {!item.isActive && (
                   <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Nonaktif</span>
                 )}
               </div>
               {item.category && <div className="text-xs text-gray-500">{item.category}</div>}
             </div>
             <div className="text-sm font-medium">Rp{item.price.toLocaleString('id-ID')}</div>
          </Link>
         </li>
        ))}
      </ul>
    </div>
  );
}