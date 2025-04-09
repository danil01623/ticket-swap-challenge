"use client";

import { Calendar, Loader, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLocation, fetchEventsByLocation } from "@/requests/api";
import Image from "next/image";
import Link from "next/link";

interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
  imageUrl: string;
}

interface Event {
  id: number;
  name: string;
  alerts: number;
  date: string;
  locationId: number;
  description: string | null;
  imageUrl: string;
}

export default function LocationPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // Fetch location by id
        const locationData = await fetchLocation(params.id, controller.signal);

        if (!locationData?.location) {
          throw new Error("Location not found");
        }
        setLocation(locationData.location);

        // Fetch events for this location
        const eventsData = await fetchEventsByLocation(
          locationData.location.id,
          controller.signal
        );
        setEvents(eventsData.events || []);
        setError(null);
      } catch (error) {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup
    return () => {
      controller.abort();
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid place-items-center h-[50vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 my-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="max-w-3xl mx-auto p-4 my-4">
        <div className="text-gray-500">Location not found</div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4 my-4 grid gap-6">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={location.imageUrl}
          alt={`${location.name} venue image`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">{location.name}</h1>

        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-5 h-5" />
          <span>
            {location.city}, {location.country}
          </span>
        </div>
      </div>

      {events.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid gap-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="relative w-32 aspect-video rounded overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
