import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("user_id", "", { path: "/", maxAge: 0 });
  return res;
} 