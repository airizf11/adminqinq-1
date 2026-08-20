// adminqinq/src/app/(app)/items/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Package, Tag } from 'lucide-react';

type Item = { id: string; name: string; sku: string | null; price: number; category: string | null; isActive: boolean };

function groupByCategory(items: Item[]) {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const key = item.category?.trim() || 'Lainnya';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === 'Lainnya') return 1;
    if (b === 'Lainnya') return -1;
    return a.localeCompare(b);
  });
}

export default async function ItemsPage() {
  const res = await cotebek<{ data: Item[] }>('/items?includeInactive=true');
  const items = res.data;
  const grouped = groupByCategory(items);

  return (
    <div className="p-4 pb-24 space-y-5">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Item</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola daftar harga usahamu.</p>
        </div>
        <Link href="/items/new" className={cn(buttonVariants({ size: "sm" }), "rounded-full shadow-md")}>
          <Plus size={16} className="mr-1" /> Tambah
        </Link>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Package className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">Belum ada item</p>
          <p className="text-sm text-muted-foreground mt-1">Tambahkan item pertama untuk mulai mencatat order.</p>
        </div>
      )}

      {grouped.map(([category, categoryItems]) => (
        <div key={category} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Tag size={13} className="text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</h2>
            <span className="text-[10px] text-muted-foreground/70">({categoryItems.length})</span>
          </div>
          <ul className="space-y-2">
            {categoryItems.map((item) => (
              <li key={item.id}>
                <Link href={`/items/${item.id}`}>
                  <Card className={cn(
                    "shadow-sm border-border hover:shadow-md transition-all duration-200 active:scale-[0.98]",
                    !item.isActive && "opacity-60 bg-muted/20"
                  )}>
                    <CardContent className="p-3.5 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn("p-2.5 rounded-full", item.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                          <Package size={18} />
                        </div>
                        <div className="flex flex-col truncate">
                          <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                            {item.name}
                            {!item.isActive && <Badge variant="secondary" className="text-[9px] px-1 h-4">Nonaktif</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-foreground bg-secondary/50 px-3 py-1 rounded-full">
                        Rp{item.price.toLocaleString('id-ID')}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}