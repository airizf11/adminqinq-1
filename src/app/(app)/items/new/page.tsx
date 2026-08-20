// adminqinq/src/app/(app)/items/new/page.tsx
'use client';

import { useState } from 'react';
import { createItem } from '../actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ItemFormFields } from '../ItemFormFields';
import { Loader2 } from 'lucide-react';

export default function NewItemPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createItem(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold text-foreground mb-4">Tambah Item</h1>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form action={handleSubmit} className="space-y-4">
            <ItemFormFields />
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