// adminqinq/src/app/(app)/items/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

export async function updateItem(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const cogs = formData.get("cogs") ? Number(formData.get("cogs")) : undefined;
  const category = (formData.get("category") as string) || undefined;
  const sku = (formData.get("sku") as string) || undefined;

  try {
    await cotebek(`/items/${id}`, {
      method: "PUT",
      body: { name, price, cogs, category, sku },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal update layanan." };
  }

  revalidatePath(`/items/${id}`);
  revalidatePath("/items");
  return { success: true };
}

export async function toggleItemActive(id: string, isActive: boolean) {
  try {
    await cotebek(`/items/${id}`, { method: "PUT", body: { isActive } });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal update status layanan.",
    };
  }
  revalidatePath(`/items/${id}`);
  revalidatePath("/items");
  return { success: true };
}
