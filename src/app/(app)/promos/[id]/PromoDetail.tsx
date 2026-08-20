// adminqinq/src/app/(app)/promos/[id]/PromoDetail.tsx
'use client';

import { useState } from 'react';
import { updatePromo, togglePromoActive } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

type Promo = {
  id: string; name: string; code: string | null;
  type: 'PERCENTAGE' | 'NOMINAL'; value: number;
  minOrder: number | null; maxDiscount: number | null;
  usageLimit: number | null; usageCount: number; maxUsagePerCustomer: number | null;
  isActive: boolean;
};

export function PromoDetail({ promo }: { promo: Promo }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [isActive, setIsActive] = useState(promo.isActive);
  const [togglePending, setTogglePending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const result = await updatePromo(promo.id, formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setSaved(true);
  }

  async function handleToggle(next: boolean) {
    setTogglePending(true);
    const result = await togglePromoActive(promo.id, next);
    setTogglePending(false);
    if (result?.error) setError(result.error);
    else setIsActive(next);
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-3 flex justify-between items-center">
          <div>
            <div className="font-medium text-sm text-foreground">Status Promo</div>
            <div className="text-xs text-muted-foreground">{isActive ? 'Aktif — bisa dipakai customer' : 'Nonaktif — gak bisa dipakai'}</div>
          </div>
          <Switch checked={isActive} onCheckedChange={handleToggle} disabled={togglePending} />
        </CardContent>
      </Card>

      {promo.code && (
        <Card className="shadow-sm">
          <CardContent className="p-3 text-sm">
            <div className="text-muted-foreground text-xs mb-1">Kode</div>
            <div className="font-mono font-medium text-foreground">{promo.code}</div>
          </CardContent>
        </Card>
      )}

      {promo.usageLimit && (
        <Card className="shadow-sm">
          <CardContent className="p-3 text-sm flex justify-between">
            <span className="text-muted-foreground">Pemakaian</span>
            <span className="font-medium text-foreground">{promo.usageCount} / {promo.usageLimit}</span>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Promo</Label>
              <Input id="name" name="name" required defaultValue={promo.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Nilai {promo.type === 'PERCENTAGE' ? '(%)' : '(Rp)'}</Label>
              <Input id="value" name="value" type="number" min="0" defaultValue={promo.value} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="minOrder">Min. Belanja</Label>
                <Input id="minOrder" name="minOrder" type="number" min="0" defaultValue={promo.minOrder ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Maks. Diskon</Label>
                <Input id="maxDiscount" name="maxDiscount" type="number" min="0" defaultValue={promo.maxDiscount ?? ''} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Limit Total</Label>
                <Input id="usageLimit" name="usageLimit" type="number" min="1" defaultValue={promo.usageLimit ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsagePerCustomer">Limit / Pelanggan</Label>
                <Input id="maxUsagePerCustomer" name="maxUsagePerCustomer" type="number" min="1" defaultValue={promo.maxUsagePerCustomer ?? ''} />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && !error && <p className="text-sm text-success">Tersimpan.</p>}

            <Button type="submit" disabled={pending} className="w-full h-11 font-medium">
              {pending && <Loader2 size={16} className="mr-2 animate-spin" />}
              {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}