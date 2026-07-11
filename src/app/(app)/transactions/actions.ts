// adminqinq/src/app/(app)/transactions/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cotebek } from "@/lib/cotebek";

export async function createTransaction(formData: FormData) {
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const amount = Number(formData.get("amount"));
  const paymentMethod = formData.get("paymentMethod") as string;
  const description = (formData.get("description") as string) || undefined;
  const fee = formData.get("fee") ? Number(formData.get("fee")) : undefined;
  const transactionDate =
    (formData.get("transactionDate") as string) || undefined;

  try {
    await cotebek("/transactions", {
      method: "POST",
      body: {
        type,
        category,
        amount,
        paymentMethod,
        description,
        fee,
        transactionDate: formData.get("transactionDate") || undefined,
      },
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal mencatat transaksi.",
    };
  }

  revalidatePath("/transactions");
  redirect("/transactions");
}
