// adminqinq/src/app/(app)/items/page.tsx
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Package, Tag, AlertCircle } from 'lucide-react';

type Item = { id: string; name: string; sku: string | null; price: number; category: string | null; isActive: boolean };

export default async function ItemsPage() {
  const res = await cotebek<{ data: Item[] }>('/items?includeInactive=true');
  const items = res.data;

  return (
    <div className="p-4 pb-24 space-y-5">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">Layanan</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola daftar harga laundry-mu.</p>
        </div>
        <Link 
          href="/items/new" 
          className={cn(buttonVariants({ size: "sm" }), "rounded-full shadow-md")}
        >
          <Plus size={16} className="mr-1" /> Tambah
        </Link>
      </div>

      {/* 2. EMPTY STATE */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-2">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Package className="text-muted-foreground opacity-50" size={32} />
          </div>
          <p className="text-foreground font-medium">Belum ada layanan</p>
          <p className="text-sm text-muted-foreground mt-1">Tambahkan layanan pertama untuk mulai mencatat order.</p>
        </div>
      )}

      {/* 3. LIST LAYANAN */}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/items/${item.id}`}>
              <Card className={cn(
                "shadow-sm border-border hover:shadow-md transition-all duration-200 active:scale-[0.98]",
                !item.isActive && "opacity-60 bg-muted/20"
              )}>
                <CardContent className="p-3.5 flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "p-2.5 rounded-full",
                      item.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Package size={18} />
                    </div>
                    <div className="flex flex-col truncate">
                      <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                        {item.name}
                        {!item.isActive && <Badge variant="secondary" className="text-[9px] px-1 h-4">Nonaktif</Badge>}
                      </div>
                      {item.category && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Tag size={10} /> {item.category}
                        </div>
                      )}
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
  );
}