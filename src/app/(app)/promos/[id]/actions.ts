// adminqinq/src/app/(app)/promos/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

function val(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

export async function updatePromo(id: string, formData: FormData) {
  const payload = {
    name: val(formData, "name"),
    value: val(formData, "value") ? Number(val(formData, "value")) : undefined,
    minOrder: val(formData, "minOrder")
      ? Number(val(formData, "minOrder"))
      : undefined,
    maxDiscount: val(formData, "maxDiscount")
      ? Number(val(formData, "maxDiscount"))
      : undefined,
    usageLimit: val(formData, "usageLimit")
      ? Number(val(formData, "usageLimit"))
      : undefined,
    maxUsagePerCustomer: val(formData, "maxUsagePerCustomer")
      ? Number(val(formData, "maxUsagePerCustomer"))
      : undefined,
  };

  try {
    await cotebek(`/promos/${id}`, { method: "PUT", body: payload });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal update promo." };
  }

  revalidatePath(`/promos/${id}`);
  revalidatePath("/promos");
  return { success: true };
}

export async function togglePromoActive(id: string, isActive: boolean) {
  try {
    await cotebek(`/promos/${id}`, { method: "PUT", body: { isActive } });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal update status promo.",
    };
  }
  revalidatePath(`/promos/${id}`);
  revalidatePath("/promos");
  return { success: true };
}
