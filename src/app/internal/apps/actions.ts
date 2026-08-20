// coteadmin/src/app/internal/apps/actions.ts
"use server";

import { cotebek } from "@/lib/cotebek";

type CreatedApp = { id: string; name: string; apiKey: string };
type MyApp = {
  appId: string;
  appName: string;
  apiKey: string;
  role: string;
  status: string;
};

export async function createClientApp(
  businessName: string,
  clientEmail: string,
) {
  try {
    const res = await cotebek<{ data: CreatedApp }>("/apps", {
      method: "POST",
      body: { name: businessName },
    });

    let inviteMessage: string | null = null;
    if (clientEmail) {
      await cotebek(`/apps/${res.data.id}/invite`, {
        method: "POST",
        body: { email: clientEmail, role: "ADMIN" },
      });
      inviteMessage = `Invite terkirim ke ${clientEmail}. Klien tinggal login Google pakai email itu.`;
    }

    return { data: res.data, inviteMessage };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat app." };
  }
}

export async function listMyApps() {
  try {
    const res = await cotebek<{ data: MyApp[] }>("/users/me/apps");
    return { data: res.data };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Gagal memuat daftar app.",
    };
  }
}
