import { useState, useEffect } from "react";
import { ChevronDown, Loader, Search } from "lucide-react";
import { useDebounce } from "@/app/hook/useDebounce";
import { fetchLocations } from "@/requests/api";

interface SearchBarProps {
  onSearch: (query: string, locations?: string) => void;
}

export interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
  imageUrl: string;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const controller = new AbortController();

    const loadLocations = async () => {
      try {
        const data = await fetchLocations(controller.signal);
        setLocations(data.locations);
      } catch (err) {
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    loadLocations();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    onSearch(debouncedQuery, location);
  }, [debouncedQuery, location, onSearch]);

  return (
    <div className="flex gap-2 flex-col md:flex-row">
      <div className="flex-1 flex gap-2 items-center bg-white rounded-lg border px-3 py-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for events..."
          className="flex-1 outline-none bg-transparent text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="relative">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-68 bg-white rounded-lg border px-3 py-2 pr-8 outline-none appearance-none cursor-pointer text-black"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
        {loading ? (
          <Loader className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
