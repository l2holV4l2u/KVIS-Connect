import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { BlogRead } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props { blog: BlogRead }

export function BlogCard({ blog }: Props) {
  const initials = `${blog.author.first_name[0] ?? ""}${blog.author.last_name[0] ?? ""}`.toUpperCase();
  const tags = (blog.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="group overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 h-full flex flex-col cursor-pointer">
        {blog.cover_image_url ? (
          <div className="relative h-48 overflow-hidden bg-muted">
            <Image
              src={blog.cover_image_url}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-3 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        )}

        <CardContent className="pt-5 flex-1">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
          <h2 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h2>
          {blog.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
          )}
        </CardContent>

        <CardFooter className="pt-0 pb-4 px-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={blog.author.profile_pic_url ?? ""} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {blog.author.first_name} {blog.author.last_name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {blog.published_at ? formatDate(blog.published_at) : "Draft"}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
