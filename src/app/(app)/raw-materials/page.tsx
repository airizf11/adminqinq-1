// adminqinq/src/app/(app)/raw-materials/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

type RawMaterial = { id: string; name: string; unit: string | null; category: string | null };

function groupByCategory(materials: RawMaterial[]) {
  const groups = new Map<string, RawMaterial[]>();
  for (const m of materials) {
    const key = m.category?.trim() || 'Lainnya';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === 'Lainnya') return 1;
    if (b === 'Lainnya') return -1;
    return a.localeCompare(b);
  });
}

export default async function RawMaterialsPage() {
  const res = await cotebek<{ data: RawMaterial[] }>('/raw-materials');
  const grouped = groupByCategory(res.data);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-foreground">Bahan/Barang Beli</h1>
        <Link href="/raw-materials/new" className={cn(buttonVariants({ size: 'sm' }))}>+ Tambah</Link>
      </div>

      {res.data.length === 0 && (
        <p className="text-sm text-muted-foreground">Belum ada katalog. Tambah biar gak ketik ulang tiap catat belanja.</p>
      )}

      {grouped.map(([category, materials]) => (
        <div key={category} className="space-y-2 mb-4">
          <div className="flex items-center gap-2 px-1">
            <Tag size={13} className="text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</h2>
          </div>
          <ul className="space-y-2">
            {materials.map((m) => (
              <li key={m.id}>
                <Card className="shadow-sm">
                  <CardContent className="p-3 flex justify-between items-center">
                    <div className="font-medium text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.unit ?? '-'}</div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}