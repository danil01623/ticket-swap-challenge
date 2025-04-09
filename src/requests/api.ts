export const fetchEvent = async (id: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/events/${id}`, { signal });
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  const data = await response.json();
  return data;
};

export const fetchLocation = async (
  id: number | string,
  signal?: AbortSignal
) => {
  const response = await fetch(`/api/locations/${id}`, { signal });
  if (!response.ok) {
    return { location: null };
  }
  const data = await response.json();
  return data;
};

export const fetchEventsByLocation = async (
  locationId: number | string,
  signal?: AbortSignal
) => {
  try {
    const response = await fetch(`/api/locations/${locationId}/events`, {
      signal,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch location events");
    }

    return data;
  } catch (error) {
    if (error) {
      return { events: [] };
    }
    console.error("Error fetching location events:", error);
    throw error;
  }
};

export const fetchLocations = async (signal?: AbortSignal) => {
  try {
    const response = await fetch("/api/locations", { signal });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to fetch locations`);
    }

    return data;
  } catch (error) {
    if (error) {
      return { locations: [] };
    }
    console.error("Error fetching locations:", error);
    throw error;
  }
};
