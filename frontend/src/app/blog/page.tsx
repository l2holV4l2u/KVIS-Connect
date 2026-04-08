"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PenLine, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function BlogPage() {
  const { user } = useAuth();
  const [tag, setTag] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs", tagFilter],
    queryFn: () => blogApi.list({ tag: tagFilter || undefined, limit: 50 }),
  });

  // Collect all unique tags from fetched blogs
  const allTags = Array.from(
    new Set(blogs.flatMap((b) => (b.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean)))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alumni Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">Stories, updates, and insights from KVIS alumni</p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/blog/new"><PenLine className="h-4 w-4 mr-2" /> Write</Link>
          </Button>
        )}
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTagFilter("")}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${!tagFilter ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(tagFilter === t ? "" : t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${tagFilter === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <PenLine className="mx-auto h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">No posts yet</p>
          {user && <p className="text-sm mt-1">Be the first to share something!</p>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      )}
    </div>
  );
}
