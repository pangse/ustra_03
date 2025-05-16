import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  // 쿠키에 id 저장 (7일간)
  const res = NextResponse.json({ ok: true, user: { id } });
  res.cookies.set("user_id", id, { path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
} 