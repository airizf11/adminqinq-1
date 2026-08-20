// coteadmin/src/app/(app)/transactions/actions.ts
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

  /* function toWIBISOString(localValue: string): string {
    return `${localValue}:00+07:00`;
  } */

  const transactionDate =
    (formData.get("transactionDate") as string) || undefined;
  const paymentStatus = (formData.get("paymentStatus") as string) || undefined;
  const dueDate = (formData.get("dueDate") as string) || undefined;
  const teamMemberId = (formData.get("teamMemberId") as string) || undefined;

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
        transactionDate,
        paymentStatus,
        dueDate,
        teamMemberId,
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

export async function markTransactionPaid(id: string) {
  try {
    await cotebek(`/transactions/${id}/pay`, { method: "PATCH" });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menandai lunas." };
  }
  revalidatePath("/transactions");
  return { success: true };
}
