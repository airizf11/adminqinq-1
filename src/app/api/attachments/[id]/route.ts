// coteadmin/src/app/api/attachments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStaffToken } from "@/lib/session";

const API_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getStaffToken();

  const res = await fetch(`${API_URL}/attachments/${id}`, {
    method: "DELETE",
    headers: {
      "x-api-key": API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
