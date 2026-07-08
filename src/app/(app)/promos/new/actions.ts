// adminqinq/src/app/(app)/promos/new/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cotebek } from "@/lib/cotebek";

function val(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

export async function createPromo(formData: FormData) {
  const payload = {
    name: val(formData, "name"),
    code: val(formData, "code"),
    type: val(formData, "type"),
    value: Number(formData.get("value")),
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
    startDate: val(formData, "startDate"),
    endDate: val(formData, "endDate"),
  };

  try {
    await cotebek("/promos", { method: "POST", body: payload });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat promo." };
  }

  revalidatePath("/promos");
  redirect("/promos");
}
