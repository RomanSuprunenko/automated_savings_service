import { NextResponse } from "next/server";
import { suggestTransfer } from "@/server/savings-logic";

export async function POST() {
  const result = await suggestTransfer();
  return NextResponse.json(result);
}
