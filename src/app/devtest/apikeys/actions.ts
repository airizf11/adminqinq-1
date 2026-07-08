// adminqinq/src/app/devtest/apikeys/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

export async function createApp(name: string) {
  try {
    await cotebek("/apps", { method: "POST", body: { name } });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat app." };
  }
  revalidatePath("/devtest/apikeys");
}
