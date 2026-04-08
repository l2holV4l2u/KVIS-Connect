"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Eye, Edit3, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().optional(),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string().optional(),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function NewBlogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_published: false, content: "" },
  });

  const content = watch("content") ?? "";

  const mutation = useMutation({
    mutationFn: (data: FormData) => blogApi.create({
      ...data,
      cover_image_url: data.cover_image_url || undefined,
      excerpt: data.excerpt || undefined,
    }),
    onSuccess: (blog) => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast({ title: "Post created!" });
      router.push(`/blog/${blog.slug}`);
    },
    onError: () => {
      toast({ title: "Failed to create post", variant: "destructive" });
    },
  });

  if (loading || !user) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Write a Post</h1>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input placeholder="Your post title…" className="text-lg" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Cover Image URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input placeholder="https://…" {...register("cover_image_url")} />
              {errors.cover_image_url && <p className="text-xs text-destructive">{errors.cover_image_url.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input placeholder="e.g. Career, Research, Life" {...register("tags")} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Excerpt <span className="text-muted-foreground text-xs">(optional short summary)</span></Label>
            <Textarea rows={2} placeholder="Brief description shown in the blog list…" {...register("excerpt")} />
          </div>
        </div>

        {/* Editor + Preview tabs */}
        <Card className="mb-6">
          <Tabs defaultValue="write">
            <CardHeader className="pb-0">
              <TabsList className="w-40">
                <TabsTrigger value="write" className="flex-1"><Edit3 className="h-3.5 w-3.5 mr-1" /> Write</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1"><Eye className="h-3.5 w-3.5 mr-1" /> Preview</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="write" className="mt-0">
                <Textarea
                  rows={18}
                  placeholder="Write your post in Markdown…

## Example heading

**Bold text** and *italic text*

- List item one
- List item two"
                  className="font-mono text-sm resize-none"
                  {...register("content")}
                />
                {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
                <p className="text-xs text-muted-foreground mt-2">Supports Markdown + GFM</p>
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                {content ? (
                  <div className="prose min-h-[400px] border rounded-md p-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="min-h-[400px] flex items-center justify-center text-muted-foreground text-sm border rounded-md">
                    Nothing to preview yet
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Button
            type="submit"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() => setValue("is_published", false)}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            onClick={() => setValue("is_published", true)}
          >
            {mutation.isPending
              ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
              : <Send className="h-4 w-4 mr-2" />
            }
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
