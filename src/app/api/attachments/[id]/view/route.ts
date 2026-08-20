// coteadmin/src/app/api/attachments/[id]/view/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStaffToken } from "@/lib/session";

const API_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getStaffToken();

  const res = await fetch(`${API_URL}/attachments/${id}/view`, {
    headers: {
      "x-api-key": API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok)
    return NextResponse.json(
      { error: "Gagal ambil file." },
      { status: res.status },
    );

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        res.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": res.headers.get("content-disposition") ?? "inline",
    },
  });
}
