// coteadmin/src/app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStaffToken } from "@/lib/session";

const API_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

export async function GET(req: NextRequest) {
  const token = await getStaffToken();
  const qs = req.nextUrl.search;

  const res = await fetch(`${API_URL}/reports/export${qs}`, {
    headers: {
      "x-api-key": API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Gagal generate laporan." },
      { status: res.status },
    );
  }

  const buffer = await res.arrayBuffer();
  const filename =
    res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ??
    "laporan.xlsx";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
