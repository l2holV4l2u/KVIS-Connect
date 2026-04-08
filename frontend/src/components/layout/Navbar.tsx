"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, Search, BookOpen, User, LogOut, Settings } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <GraduationCap className="h-6 w-6" />
          KVIS Connect
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Search className="h-4 w-4" /> Directory
          </Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-offset-2 focus:ring-2 focus:ring-ring">
                  <Avatar className="h-9 w-9 cursor-pointer">
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Join</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
