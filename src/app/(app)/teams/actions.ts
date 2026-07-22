// adminqinq/src/app/(app)/teams/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cotebek } from "@/lib/cotebek";

export async function inviteMember(
  appId: string,
  email: string,
  role: "STAFF" | "ADMIN",
) {
  try {
    await cotebek(`/apps/${appId}/invite`, {
      method: "POST",
      body: { email, role },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal mengundang." };
  }
  revalidatePath("/members");
  return { success: true };
}

export async function removeMember(appId: string, userId: string) {
  try {
    await cotebek(`/apps/${appId}/members/${userId}`, { method: "DELETE" });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal menghapus anggota.",
    };
  }
  revalidatePath("/members");
  return { success: true };
}

export async function addTeamMember(name: string, phone?: string) {
  try {
    await cotebek("/team-members", { method: "POST", body: { name, phone } });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal menambah anggota.",
    };
  }
  revalidatePath("/teams");
  return { success: true };
}
