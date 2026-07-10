"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Mentor {
  id: string;
  name: string;
  department: string;
  avatarUrl?: string;
  skillName: string;
  categoryId: string;
  level: SkillLevel;
  rating: number;
}

interface MentorCardProps {
  mentor: Mentor;
  onRequest?: (mentor: Mentor) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getAvatarColorClass(name: string) {
  const tints = [
    "bg-accent text-accent-foreground",
    "bg-warning/15 text-warning",
    "bg-success/15 text-success",
    "bg-destructive/15 text-destructive",
  ];
  const index = (name.charCodeAt(0) || 0) % tints.length;
  return tints[index];
}

function levelBadgeVariant(level: SkillLevel) {
  if (level === "beginner") return "success" as const;
  if (level === "intermediate") return "warning" as const;
  return "default" as const;
}

function levelLabel(level: SkillLevel) {
  if (level === "beginner") return "Beginner";
  if (level === "intermediate") return "Intermediate";
  return "Advanced";
}

export function MentorCard({ mentor, onRequest }: MentorCardProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-start gap-3 p-5">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
          <AvatarFallback className={getAvatarColorClass(mentor.name)}>
            {getInitials(mentor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-md font-semibold text-foreground">
            {mentor.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {mentor.department}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-5 pt-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {mentor.skillName}
          </p>
          <Badge variant={levelBadgeVariant(mentor.level)}>
            {levelLabel(mentor.level)}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3.5 w-3.5",
                  star <= Math.round(mentor.rating)
                    ? "fill-star text-star"
                    : "text-border"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">
            {mentor.rating.toFixed(1)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5">
        <Button
          type="button"
          className="w-full"
          onClick={() => onRequest?.(mentor)}
        >
          Kirim Request
        </Button>
      </CardFooter>
    </Card>
  );
}