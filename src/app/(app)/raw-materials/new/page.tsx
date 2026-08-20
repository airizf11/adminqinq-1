// adminqinq/src/app/(app)/raw-materials/new/page.tsx
'use client';

import { useState } from 'react';
import { createRawMaterial } from '../actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function NewRawMaterialPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createRawMaterial(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-foreground mb-4">Tambah Bahan/Barang</h1>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" required placeholder="LPG 12kg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan (opsional)</Label>
              <Input id="unit" name="unit" placeholder="tabung, kg, liter, dll" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori (opsional)</Label>
              <Input id="category" name="category" placeholder="Operasional" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={pending} className="w-full h-11 font-medium">
              {pending && <Loader2 size={16} className="mr-2 animate-spin" />}
              {pending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}