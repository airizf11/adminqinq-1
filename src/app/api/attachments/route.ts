// coteadmin/src/app/api/attachments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStaffToken } from "@/lib/session";

const API_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

export async function POST(req: NextRequest) {
  const token = await getStaffToken();
  const formData = await req.formData();

  const res = await fetch(`${API_URL}/attachments`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
