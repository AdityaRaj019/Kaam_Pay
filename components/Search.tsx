"use client";

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({ 
  onSearch, 
  placeholder = "Try 'UX Design' or 'Creative Writing'...", 
  className = "" 
}) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"Work" | "Hire">("Work");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative z-20 group w-full max-w-4xl bg-white rounded-full p-1.5 flex items-center shadow-2xl shadow-primary/20 border border-white/10 ${className}`}
    >
      <div className="flex bg-gray-100 rounded-full p-1 mr-4 border border-black/5">
        {["Work", "Hire"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m as "Work" | "Hire")}
            className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${
              mode === m 
                ? "bg-white text-[#4a4bd7] shadow-md ring-1 ring-black/5" 
                : "text-[#2c3437]/40 hover:text-[#2c3437]/80"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center px-4">
        <SearchIcon className="w-5 h-5 text-[#2c3437]/30 mr-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none text-[#2c3437] placeholder:text-[#2c3437]/40 focus:outline-none font-bold"
        />
      </div>

      <button 
        type="submit"
        className="bg-[#4a4bd7] text-white px-12 py-3.5 rounded-full text-base font-black hover:bg-[#3b3bc2] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#4a4bd7]/40"
      >
        Search
      </button>
    </form>

  );
};

