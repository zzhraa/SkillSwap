// app/reviews/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewCard, type Review } from "@/components/reviews/ReviewCard";
import { RatingStars } from "@/components/reviews/RatingStars";
import {
  ReviewForm,
  type ReviewFormValues,
} from "@/components/reviews/ReviewForm";

interface MentorInfo {
  id: string;
  name: string;
  department: string;
  avatarUrl?: string;
}

const mentor: MentorInfo = {
  id: "mentor-1",
  name: "Dimas Pratama",
  department: "Teknik Informatika, Semester 6",
};

const initialReviews: Review[] = [
  {
    id: "review-1",
    reviewerName: "Rina Kusuma",
    rating: 5,
    comment:
      "Penjelasannya sangat jelas dan sabar banget waktu aku masih bingung soal React hooks. Recommended!",
    createdAt: "2026-06-28T14:00:00",
  },
  {
    id: "review-2",
    reviewerName: "Bayu Aditya",
    rating: 4,
    comment:
      "Sesi belajarnya membantu banget untuk persiapan project akhir. Waktu belajar fleksibel.",
    createdAt: "2026-06-20T10:30:00",
  },
  {
    id: "review-3",
    reviewerName: "Putri Amalia",
    rating: 5,
    comment: "Mentor yang sangat komunikatif, materinya runtut dan mudah diikuti.",
    createdAt: "2026-06-10T18:15:00",
  },
];

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

export default function ReviewsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [reviews]
  );

  function handleSubmitReview(values: ReviewFormValues) {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      reviewerName: "Kamu",
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search reviews..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Rating & Review
              </h1>
              <p className="text-sm text-muted-foreground">
                Lihat ulasan dan beri review untuk mentor kamu
              </p>
            </div>

            <Card className="shadow-card">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar className="h-16 w-16 shrink-0">
                    <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                    <AvatarFallback className={getAvatarColorClass(mentor.name)}>
                      {getInitials(mentor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-semibold text-foreground">
                      {mentor.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {mentor.department}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-foreground">
                      {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                    </span>
                    <RatingStars value={Math.round(averageRating)} readOnly size="sm" />
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-star text-star" />
                    {reviews.length} review
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <Card className="shadow-card lg:col-span-2">
                <CardContent className="p-5">
                  <ReviewForm mentorName={mentor.name} onSubmit={handleSubmitReview} />
                </CardContent>
              </Card>

              <section className="space-y-4 lg:col-span-3">
                <div>
                  <h2 className="text-md font-semibold text-foreground">
                    Semua Review
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {sortedReviews.length} ulasan dari mahasiswa lain
                  </p>
                </div>

                {sortedReviews.length === 0 ? (
                  <Card className="shadow-card">
                    <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                        <Star className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Belum ada review
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Jadilah yang pertama memberikan review untuk mentor ini
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {sortedReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}