// adminqinq/src/app/(app)/promos/new/page.tsx
'use client';

import { useState } from 'react';
import { createPromo } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function NewPromoPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [type, setType] = useState<'PERCENTAGE' | 'NOMINAL'>('PERCENTAGE');

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createPromo(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold text-foreground mb-4">Buat Promo</h1>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Promo *</Label>
              <Input id="name" name="name" required placeholder="Diskon Kemerdekaan" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Kode (opsional)</Label>
              <Input id="code" name="code" className="uppercase" placeholder="MERDEKA17" />
              <p className="text-xs text-muted-foreground">Kosongkan kalau diskon otomatis tanpa kode.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Jenis</Label>
                <input type="hidden" name="type" value={type} />
                <Select value={type} onValueChange={(v) => setType((v ?? 'PERCENTAGE') as 'PERCENTAGE' | 'NOMINAL')}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                    <SelectItem value="NOMINAL">Nominal (Rp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Nilai *</Label>
                <Input id="value" name="value" type="number" min="0" required placeholder="10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="minOrder">Min. Belanja (Rp)</Label>
                <Input id="minOrder" name="minOrder" type="number" min="0" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Maks. Diskon (Rp)</Label>
                <Input id="maxDiscount" name="maxDiscount" type="number" min="0" placeholder="Tanpa batas" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Limit Total Pakai</Label>
                <Input id="usageLimit" name="usageLimit" type="number" min="1" placeholder="Tanpa batas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsagePerCustomer">Limit / Pelanggan</Label>
                <Input id="maxUsagePerCustomer" name="maxUsagePerCustomer" type="number" min="1" placeholder="Tanpa batas" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Mulai</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Berakhir</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
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