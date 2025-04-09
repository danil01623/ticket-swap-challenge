import { NextResponse } from "next/server";
import { locations } from "@/lib/mock-data";

export async function GET() {
  try {
    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { message: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
