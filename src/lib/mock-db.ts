import { getEvents, locations } from "./mock-data";

export const database = {
  getPopularEvents: async (amount: number, offset: number) => {
    const events = await getEvents();

    return events
      .toSorted((a, b) => b.alerts - a.alerts)
      .slice(offset, amount + offset);
  },
  getEvent: async (id: number) => {
    const events = await getEvents();

    return events.find((event) => event.id === id) ?? null;
  },

  searchEvents: async (query: string, location?: string) => {
    const events = await getEvents();
    const normalizedQuery = query.toLowerCase();
    const normalizedLocation = location?.toLowerCase() || "";
    console.log(normalizedQuery);

    return events.filter((event) => {
      const matchesQuery =
        !query || event.name.toLowerCase().includes(normalizedQuery);

      const locationMatch =
        !location ||
        locations
          .find((loc) => loc.id === event.locationId)
          ?.name.toLowerCase()
          ?.includes(normalizedLocation);

      return matchesQuery && locationMatch;
    });
  },
};
