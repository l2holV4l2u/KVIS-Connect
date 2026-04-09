"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, BookOpen, User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import type { GlobePin } from "@/lib/types";

function AlumniSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { data: pins = [] } = useQuery({
    queryKey: ["globe-pins"],
    queryFn: userApi.getGlobePins,
    staleTime: 5 * 60 * 1000,
  });

  const results: GlobePin[] = query.trim().length === 0 ? [] : pins.filter((p) => {
    const q = query.toLowerCase();
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    return name.includes(q) || p.country?.toLowerCase().includes(q) || p.current_job?.toLowerCase().includes(q);
  }).slice(0, 8);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={wrapRef} className="relative flex-1">
      <div className="flex items-center gap-2 px-4">
        <Search className="h-4 w-4 text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search alumni..."
          className="flex-1 py-2.5 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400 w-full"
        />
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "1px solid #e2e8f0",
            zIndex: 999,
          }}
        >
          {results.map((p) => (
            <button
              key={p.user_id}
              onMouseDown={() => { router.push(`/profile/${p.user_id}`); setOpen(false); setQuery(""); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 transition-all text-left group border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-50"
            >
              <div
                className="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "#1e3a5f", border: "2px solid #3b82f6" }}
              >
                {p.profile_pic_url
                  ? <img src={p.profile_pic_url} alt="" className="w-full h-full object-cover" />
                  : `${p.first_name[0]}${p.last_name[0]}`}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">{p.first_name} {p.last_name}</p>
                <p className="text-xs text-gray-400 truncate">{[p.current_job, p.country].filter(Boolean).join(" · ")}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 pointer-events-none">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white drop-shadow pointer-events-auto shrink-0">
        <GraduationCap className="h-5 w-5" />
        KVIS Connect
      </Link>

      {/* Center: search + blog */}
      <div className="flex items-center bg-white rounded-full shadow-md pointer-events-auto overflow-visible mx-6 flex-1 max-w-lg">
        <AlumniSearch />
        <div className="w-px h-5 bg-gray-200 shrink-0" />
        <Link href="/blog" className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap shrink-0">
          <BookOpen className="h-4 w-4" /> Blog
        </Link>
      </div>

      {/* Right: auth */}
      <div className="flex items-center gap-3 pointer-events-auto shrink-0">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none ring-offset-2 focus:ring-2 focus:ring-white/50">
                <Avatar className="h-9 w-9 cursor-pointer shadow-md">
                  <AvatarImage src={user.profile_pic_url ?? ""} alt={user.first_name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.id}`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/edit" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Edit Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
              <Link href="/auth/register">Join</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
