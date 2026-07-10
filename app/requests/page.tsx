"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  RequestForm,
  type RequestFormValues,
  type RequestMentorOption,
  type RequestSkillOption,
} from "@/components/request/RequestForm";
import {
  RequestCard,
  type LearningRequest,
} from "@/components/request/RequestCard";

const mentors: RequestMentorOption[] = [
  { id: "mentor-1", name: "Dimas Pratama", department: "Teknik Informatika" },
  { id: "mentor-2", name: "Rina Kusuma", department: "Desain Komunikasi Visual" },
  { id: "mentor-3", name: "Sari Dewi", department: "Sastra Inggris" },
  { id: "mentor-4", name: "Bayu Aditya", department: "Manajemen" },
];

const skills: RequestSkillOption[] = [
  { id: "skill-1", mentorId: "mentor-1", name: "React.js", level: "advanced" },
  { id: "skill-2", mentorId: "mentor-1", name: "Next.js", level: "intermediate" },
  { id: "skill-3", mentorId: "mentor-2", name: "UI/UX Design", level: "intermediate" },
  { id: "skill-4", mentorId: "mentor-3", name: "Conversational English", level: "advanced" },
  { id: "skill-5", mentorId: "mentor-4", name: "Public Speaking", level: "beginner" },
];

const initialRequests: LearningRequest[] = [
  {
    id: "req-1",
    mentorName: "Dimas Pratama",
    mentorDepartment: "Teknik Informatika",
    skillName: "React.js",
    mode: "online",
    proposedDate: "2026-07-10",
    proposedTime: "19:00",
    message: "Ingin belajar dasar React hooks dan state management.",
    status: "accepted",
  },
  {
    id: "req-2",
    mentorName: "Sari Dewi",
    mentorDepartment: "Sastra Inggris",
    skillName: "Conversational English",
    mode: "offline",
    proposedDate: "2026-07-12",
    proposedTime: "16:00",
    location: "Perpustakaan Kampus, Lantai 2",
    message: "Ingin latihan speaking untuk persiapan wawancara kerja.",
    status: "pending",
  },
];

function mentorNameById(mentorId: string) {
  return mentors.find((mentor) => mentor.id === mentorId)?.name ?? "Mentor";
}

function mentorDepartmentById(mentorId: string) {
  return mentors.find((mentor) => mentor.id === mentorId)?.department ?? "";
}

function skillNameById(skillId: string) {
  return skills.find((skill) => skill.id === skillId)?.name ?? "Skill";
}

export default function RequestPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [requests, setRequests] = useState<LearningRequest[]>(initialRequests);

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) =>
          new Date(`${b.proposedDate}T${b.proposedTime}`).getTime() -
          new Date(`${a.proposedDate}T${a.proposedTime}`).getTime()
      ),
    [requests]
  );

  function handleSubmitRequest(values: RequestFormValues) {
    const newRequest: LearningRequest = {
      id: `req-${Date.now()}`,
      mentorName: mentorNameById(values.mentorId),
      mentorDepartment: mentorDepartmentById(values.mentorId),
      skillName: skillNameById(values.skillId),
      mode: values.mode,
      proposedDate: values.preferredDate,
      proposedTime: values.preferredTime,
      location: values.location,
      message: values.message,
      status: "pending",
    };
    setRequests((prev) => [newRequest, ...prev]);
  }

  function handleCancelRequest(request: LearningRequest) {
    setRequests((prev) => prev.filter((item) => item.id !== request.id));
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search learning requests..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Kirim Learning Request
              </h1>
              <p className="text-sm text-muted-foreground">
                Ajukan permintaan belajar kepada mentor pilihanmu
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <Card className="shadow-card lg:col-span-2">
                <CardContent className="p-5">
                  <RequestForm
                    mentors={mentors}
                    skills={skills}
                    onSubmit={handleSubmitRequest}
                  />
                </CardContent>
              </Card>

              <section className="space-y-4 lg:col-span-3">
                <div>
                  <h2 className="text-md font-semibold text-foreground">
                    Riwayat Request
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {sortedRequests.length} request yang pernah dikirim
                  </p>
                </div>

                {sortedRequests.length === 0 ? (
                  <Card className="shadow-card">
                    <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                        <Inbox className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Belum ada learning request
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Kirim request pertamamu menggunakan form di samping
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {sortedRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onCancel={handleCancelRequest}
                      />
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