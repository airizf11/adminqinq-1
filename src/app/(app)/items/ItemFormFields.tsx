// coteadmin/src/app/(app)/items/ItemFormFields.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ItemFieldValues = {
  name?: string;
  price?: number;
  category?: string | null;
  cogs?: number | null;
};

export function ItemFormFields({ defaultValues }: { defaultValues?: ItemFieldValues }) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Item/Produk</Label>
        <Input id="name" name="name" required defaultValue={defaultValues?.name} placeholder="Cth: Cuci Kilat 3kg, Nasi Goreng Spesial" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Harga (Rp)</Label>
        <Input id="price" name="price" type="number" min="0" required defaultValue={defaultValues?.price} placeholder="15000" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori {defaultValues ? '' : '(opsional)'}</Label>
        <Input id="category" name="category" defaultValue={defaultValues?.category ?? ''} placeholder="Cth: Cuci Kering, Makanan Utama" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cogs">Modal / COGS {defaultValues ? '' : '(opsional)'}</Label>
        <Input id="cogs" name="cogs" type="number" min="0" defaultValue={defaultValues?.cogs ?? ''} placeholder="5000" />
      </div>
    </>
  );
}