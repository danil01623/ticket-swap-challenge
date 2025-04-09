"use client";

import { Calendar, Loader, AArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PopularEventsProps {
  searchQuery?: string;
  searchLocation?: string;
}

export function PopularEvents({
  searchQuery = "",
  searchLocation = "",
}: PopularEventsProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      setLoading(true);
      const endpoint =
        searchQuery || searchLocation
          ? `/api/events/search?q=${encodeURIComponent(
              searchQuery
            )}&location=${encodeURIComponent(searchLocation)}`
          : "/api/events/popular?amount=6";

      const data = await fetch(endpoint).then((response) => response.json());

      setEvents(data.events);
      setLoading(false);
    };

    fetchPopularEvents();
  }, [searchQuery, searchLocation]);
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      <h1 className="text-xl text-black md:col-span-3 flex items-center gap-2 dark:text-gray-500">
        <Calendar />{" "}
        {searchQuery || searchLocation ? "Search results" : "Popular events"}
      </h1>
      {loading && (
        <div className="grid place-items-center md:col-span-3 p-10">
          <Loader className="animate-spin" />
        </div>
      )}

      {!loading && !events.length && (
        <div className="md:col-span-3 text-center py-10 text-gray-500">
          No events found
        </div>
      )}

      {!loading &&
        events.map((event) => (
          <Link
            href={`/events/${event?.id}`}
            key={event?.id}
            className="hover:opacity-90 transition-opacity"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 p-2">
                <h1 className="text-sm text-primary-foreground">
                  {event.name}
                </h1>
                <p className="text-xs text-secondary-foreground">
                  {event.locationId} -{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <Image
                className="object-cover h-full w-full"
                src={event.imageUrl}
                alt={`${event.name} event image`}
                width={320}
                height={200}
              />
            </div>
          </Link>
        ))}
    </div>
  );
}
