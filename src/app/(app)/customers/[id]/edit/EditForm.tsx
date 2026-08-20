// adminqinq/src/app/(app)/customers/[id]/edit/EditForm.tsx
'use client';
import { useState } from 'react';
import { updateCustomer } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerFormFields } from '../../CustomerFormFields';
import { Loader2 } from 'lucide-react';

type CustomerDetail = {
  id: string; name: string; phone: string; email: string | null;
  gender: string | null; birthDate: string | null;
  addressDetail: string | null; village: string | null; district: string | null;
  city: string | null; province: string | null; postalCode: string | null;
  notes: string | null; tags: string[] | null;
};

export function EditForm({ customer }: { customer: CustomerDetail }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await updateCustomer(customer.id, formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <form action={handleSubmit} className="space-y-4">
          <CustomerFormFields defaultValues={customer} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending} className="w-full h-11 font-medium">
            {pending && <Loader2 size={16} className="mr-2 animate-spin" />}
            {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}