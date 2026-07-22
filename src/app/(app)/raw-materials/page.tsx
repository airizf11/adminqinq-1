// adminqinq/src/app/(app)/raw-materials/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';

type RawMaterial = { id: string; name: string; unit: string | null; category: string | null };

export default async function RawMaterialsPage() {
  const res = await cotebek<{ data: RawMaterial[] }>('/raw-materials');
  const materials = res.data;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Bahan/Barang Beli</h1>
        <Link href="/raw-materials/new" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
          + Tambah
        </Link>
      </div>

      {materials.length === 0 && <p className="text-sm text-gray-500">Belum ada katalog. Tambah biar gak ketik ulang tiap catat belanja.</p>}

      <ul className="space-y-2">
        {materials.map((m) => (
          <li key={m.id} className="border rounded-lg p-3 flex justify-between items-center">
            <div className="font-medium">{m.name}</div>
            <div className="text-xs text-gray-500">{m.category ?? '-'}{m.unit ? ` · ${m.unit}` : ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}