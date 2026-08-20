// adminqinq/src/app/(app)/items/[id]/ItemDetail.tsx
'use client';

import { useState } from 'react';
import { updateItem, toggleItemActive } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ItemFormFields } from '../ItemFormFields';
import { Loader2 } from 'lucide-react';

type Item = { id: string; name: string; sku: string | null; price: number; cogs: number; category: string | null; isActive: boolean };

export function ItemDetail({ item }: { item: Item }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [isActive, setIsActive] = useState(item.isActive);
  const [togglePending, setTogglePending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const result = await updateItem(item.id, formData);
    setPending(false);
    if (result?.error) setError(result.error);
    else setSaved(true);
  }

  async function handleToggle(next: boolean) {
    setTogglePending(true);
    const result = await toggleItemActive(item.id, next);
    setTogglePending(false);
    if (result?.error) setError(result.error);
    else setIsActive(next);
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-3 flex justify-between items-center">
          <div>
            <div className="font-medium text-sm text-foreground">Status Item</div>
            <div className="text-xs text-muted-foreground">
              {isActive ? 'Aktif — bisa dipilih di order baru' : 'Nonaktif — sementara gak muncul di order baru'}
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={handleToggle} disabled={togglePending} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form action={handleSubmit} className="space-y-4">
            <ItemFormFields defaultValues={item} />
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