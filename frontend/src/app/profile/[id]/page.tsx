"use client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin, GraduationCap, Briefcase, Facebook, Linkedin,
  Globe, Mail, ExternalLink, Calendar,
} from "lucide-react";
import { degreeLabel, jobFieldLabel } from "@/lib/constants/options";
import { COUNTRY_MAP } from "@/lib/constants/countries";
import { kvisYearLabel, formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const MBTI_COLORS: Record<string, string> = {
  INTJ: "bg-violet-100 text-violet-800 border-violet-200",
  INTP: "bg-violet-100 text-violet-800 border-violet-200",
  ENTJ: "bg-violet-100 text-violet-800 border-violet-200",
  ENTP: "bg-violet-100 text-violet-800 border-violet-200",
  INFJ: "bg-emerald-100 text-emerald-800 border-emerald-200",
  INFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ENFJ: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ENFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ISTJ: "bg-blue-100 text-blue-800 border-blue-200",
  ISFJ: "bg-blue-100 text-blue-800 border-blue-200",
  ESTJ: "bg-blue-100 text-blue-800 border-blue-200",
  ESFJ: "bg-blue-100 text-blue-800 border-blue-200",
  ISTP: "bg-amber-100 text-amber-800 border-amber-200",
  ISFP: "bg-amber-100 text-amber-800 border-amber-200",
  ESTP: "bg-amber-100 text-amber-800 border-amber-200",
  ESFP: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);
  const { user: me } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userApi.getUser(userId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex gap-6 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !user) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">User not found.</div>;
  }

  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();
  const isMe = me?.id === userId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
          <AvatarImage src={user.profile_pic_url ?? ""} />
          <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
            {user.mbti && (
              <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full border ${MBTI_COLORS[user.mbti] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                {user.mbti}
              </span>
            )}
          </div>

          {user.kvis_year && (
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {kvisYearLabel(user.kvis_year)}
            </p>
          )}
          {user.place && (
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              {user.place}
            </p>
          )}

          {/* Links */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {user.facebook_url && (
              <a href={user.facebook_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {user.linkedin_url && (
              <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {user.website_url && (
              <a href={user.website_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm">
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
          </div>

          {isMe && (
            <Button size="sm" variant="outline" className="mt-4" asChild>
              <Link href="/edit">Edit Profile</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <Card className="mb-4">
          <CardContent className="pt-5">
            <p className="text-sm leading-relaxed">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Interests */}
      {user.interests && (
        <div className="flex flex-wrap gap-2 mb-6">
          {user.interests.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Education */}
      {user.education.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.education.map((edu, i) => (
              <div key={edu.id}>
                {i > 0 && <Separator className="mb-4" />}
                <div>
                  <p className="font-medium">{edu.uni_name}</p>
                  <p className="text-sm text-muted-foreground">{degreeLabel(edu.degree)} · {edu.major}</p>
                  {edu.country && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {COUNTRY_MAP.get(edu.country)?.label ?? edu.country}
                      {edu.state && `, ${edu.state}`}
                    </p>
                  )}
                  {(edu.start_year || edu.end_year) && (
                    <p className="text-xs text-muted-foreground">
                      {edu.start_year ?? "?"} – {edu.end_year ?? "Present"}
                    </p>
                  )}
                  {edu.scholarship && (
                    <Badge variant="outline" className="mt-1 text-xs">{edu.scholarship}</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Career */}
      {user.career.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Career
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.career.map((job, i) => (
              <div key={job.id}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{job.job_title}</p>
                    <p className="text-sm text-muted-foreground">{job.employer} · {jobFieldLabel(job.job_field)}</p>
                    {job.country && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {COUNTRY_MAP.get(job.country)?.label ?? job.country}
                        {job.state && `, ${job.state}`}
                      </p>
                    )}
                    {(job.start_year || job.end_year) && (
                      <p className="text-xs text-muted-foreground">
                        {job.start_year ?? "?"} – {job.is_current ? "Present" : job.end_year ?? "?"}
                      </p>
                    )}
                  </div>
                  {job.is_current && <Badge className="shrink-0 text-xs">Current</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-right">
        Joined {formatDate(user.created_at)}
      </p>
    </div>
  );
}
