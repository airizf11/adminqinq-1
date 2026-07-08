// adminqinq/src/app/(app)/customers/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cotebek } from "@/lib/cotebek";

function val(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

export async function createCustomer(formData: FormData) {
  const payload = {
    name: val(formData, "name"),
    phone: val(formData, "phone"),
    email: val(formData, "email"),
    gender: val(formData, "gender"),
    birthDate: val(formData, "birthDate"),
    addressDetail: val(formData, "addressDetail"),
    village: val(formData, "village"),
    district: val(formData, "district"),
    city: val(formData, "city"),
    province: val(formData, "province"),
    postalCode: val(formData, "postalCode"),
    notes: val(formData, "notes"),
    tags: val(formData, "tags")
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  try {
    await cotebek("/customers", { method: "POST", body: payload });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal menambah pelanggan.",
    };
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export async function deleteCustomer(id: string) {
  try {
    await cotebek(`/customers/${id}`, { method: "DELETE" });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal menghapus pelanggan.",
    };
  }
  revalidatePath("/customers");
  redirect("/customers");
}
