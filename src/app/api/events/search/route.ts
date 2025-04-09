import { database } from "@/lib/mock-db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? undefined;

  try {
    const events = await database.searchEvents(query, location);
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search events" },
      { status: 500 }
    );
  }
}
