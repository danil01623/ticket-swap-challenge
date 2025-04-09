"use client";

import { Calendar, Info, Loader, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchEvent, fetchLocation } from "@/requests/api";

export interface Event {
  id: number;
  name: string;
  alerts: number;
  date: string;
  locationId: number;
  description: string | null;
  imageUrl: string;
}

export interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
  imageUrl: string;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{
    event: Event | null;
    location: Location | null;
  }>({
    event: null,
    location: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // Fetch event by id
        const eventData = await fetchEvent(params.id, controller.signal);

        if (!eventData.event) {
          throw new Error("Event not found");
        }
        // fetching location by id
        const locationData = await fetchLocation(
          eventData.event.locationId,
          controller.signal
        );
        setData({
          event: eventData.event,
          location: locationData.location,
        });
        setError(null);
      } catch (err) {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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

  if (!data.event) {
    return (
      <div className="max-w-3xl mx-auto p-4 my-4">
        <div className="text-gray-500">Event not found</div>
      </div>
    );
  }

  const { event, location } = data;

  return (
    <main className="max-w-3xl mx-auto p-4 my-4 grid gap-6">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={`${event.name} event image`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">{event.name}</h1>

        <div className="grid gap-2 text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date(event.date).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {location ? (
              <div>
                <span className="font-medium">{location.name}</span>
                <Link
                  href={`/location/${location.id}`}
                  className="text-gray-500 hover:text-blue-500"
                >
                  {" "}
                  • {location.city}, {location.country}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <span>{event.alerts} people watching this event</span>
          </div>
        </div>

        {event.description && (
          <p className="text-gray-500 mt-2">{event.description}</p>
        )}

        {location && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">
              <Link
                href={`/location/${location.id}`}
                className="hover:text-blue-500"
              >
                Venue Information
              </Link>
            </h2>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Link href={`/location/${location.id}`}>
                <Image
                  src={location.imageUrl}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  priority
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
