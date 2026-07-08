//  adminqinq/src/app/(app)/orders/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await cotebek(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: { status },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal update status." };
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}
