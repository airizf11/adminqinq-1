// adminqinq/src/app/(app)/customers/new/page.tsx
'use client';

import { useState } from 'react';
import { createCustomer } from '../actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerFormFields } from '../CustomerFormFields';
import { Loader2 } from 'lucide-react';

export default function NewCustomerPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await createCustomer(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold text-foreground mb-4">Tambah Pelanggan</h1>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form action={handleSubmit} className="space-y-4">
            <CustomerFormFields />
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