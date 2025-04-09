import { NextResponse } from "next/server";
import { events } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Filter events by location ID
    const locationEvents = events.filter(
      (event) => event.locationId === parseInt(params.id)
    );

    return NextResponse.json({ events: locationEvents });
  } catch (error) {
    console.error("Error fetching location events:", error);
    return NextResponse.json(
      { message: "Failed to fetch location events" },
      { status: 500 }
    );
  }
}
