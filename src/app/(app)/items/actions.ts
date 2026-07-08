// adminqinq/src/app/(app)/items/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cotebek } from "@/lib/cotebek";

export async function createItem(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const cogs = formData.get("cogs") ? Number(formData.get("cogs")) : undefined;
  const category = (formData.get("category") as string) || undefined;
  const sku = (formData.get("sku") as string) || undefined;

  try {
    await cotebek("/items", {
      method: "POST",
      body: { name, price, cogs, category, sku },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menambah item." };
  }

  revalidatePath("/items");
  redirect("/items");
}
