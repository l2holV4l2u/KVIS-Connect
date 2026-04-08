"use client";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { userApi, summaryApi, searchApi } from "@/lib/api";
import { SearchFilters } from "@/components/search/SearchFilters";
import { UserCard } from "@/components/profile/ProfileCard";
import { SortBar } from "@/components/search/SortBar";
import { SummaryFooter } from "@/components/layout/SummaryFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { SearchParams } from "@/lib/types";
import { useState } from "react";

const AlumniGlobe = dynamic(() => import("@/components/globe/AlumniGlobe"), { ssr: false });

export function LandingClient() {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [sort, setSort] = useState<SearchParams["sort"]>("name");
  const [order, setOrder] = useState<SearchParams["order"]>("asc");

  const { data: pins = [] } = useQuery({
    queryKey: ["globe-pins"],
    queryFn: userApi.getGlobePins,
  });

  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: summaryApi.getSummary,
  });

  const hasSearch = Object.keys(searchParams).length > 0;

  const { data: results = [], isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchParams, sort, order],
    queryFn: () => searchApi.search({ ...searchParams, sort, order }),
    enabled: hasSearch,
  });

  return (
    <div className="flex flex-col">
      {/* Hero Globe */}
      <section className="relative h-[55vh] min-h-[400px] bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <AlumniGlobe pins={pins} />
        </div>
        <div className="absolute inset-x-0 top-8 flex flex-col items-center text-white text-center pointer-events-none z-10">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">KVIS Connect</h1>
          <p className="mt-2 text-lg text-white/80 drop-shadow">
            {pins.length > 0 ? `${pins.length} alumni across the globe` : "Connect with KVIS alumni worldwide"}
          </p>
        </div>
        {/* Gradient fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Search + Results */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <SearchFilters
              values={searchParams}
              onChange={setSearchParams}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {hasSearch ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {searchLoading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
                  </h2>
                  <SortBar sort={sort} order={order} onSort={setSort} onOrder={setOrder} />
                </div>

                {searchLoading ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-52 rounded-xl" />
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    No alumni matched your filters.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {results.map((u) => <UserCard key={u.id} user={u} />)}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">Search the alumni directory</p>
                <p className="text-sm mt-1">Use the filters on the left to find KVIS alumni</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Summary footer */}
      {summary && <SummaryFooter summary={summary} />}
    </div>
  );
}
