// adminqinq/src/app/(app)/raw-materials/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cotebek } from '@/lib/cotebek';

export async function createRawMaterial(formData: FormData) {
  const name = formData.get('name') as string;
  const unit = (formData.get('unit') as string) || undefined;
  const category = (formData.get('category') as string) || undefined;

  try {
    await cotebek('/raw-materials', { method: 'POST', body: { name, unit, category } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Gagal menambah bahan.' };
  }

  revalidatePath('/raw-materials');
  redirect('/raw-materials');
}