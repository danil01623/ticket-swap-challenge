"use client";

import { useState } from "react";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { PopularEvents } from "./components/PopularEvents";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (query: string, location?: string) => {
    setSearchQuery(query);
    setSearchLocation(location || "");
  };

  return (
    <main className="max-w-3xl mx-auto p-4 my-4 grid gap-5">
      <div className="grid gap-3">
        <Logo />
        <SearchBar onSearch={handleSearch} />
      </div>

      <PopularEvents
        searchQuery={searchQuery}
        searchLocation={searchLocation}
      />
    </main>
  );
}
