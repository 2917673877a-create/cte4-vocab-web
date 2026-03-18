import { NextResponse } from "next/server";
import { words } from "@/lib/words";

export async function GET() {
  return NextResponse.json(words);
}
