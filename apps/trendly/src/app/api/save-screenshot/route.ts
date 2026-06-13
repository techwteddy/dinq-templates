import { NextResponse } from "next/server";

// Dev-only endpoint that was used once to save screenshots. Now disabled.
export async function POST() {
  return NextResponse.json({ error: "disabled" }, { status: 410 });
}
