"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, MessageSquare } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function RequestPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [requests, setRequests] = useState<LearningRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<LearningRequest[]>([]);
  const [mentors, setMentors] = useState<RequestMentorOption[]>([]);
  const [skills, setSkills] = useState<RequestSkillOption[]>([]);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Get User
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) return;
        const { user } = await meRes.json();
        setCurrentUser(user);

        // 2. Load all available skills to extract Mentors & Skills mapping
        const skillsRes = await fetch("/api/skills");
        if (skillsRes.ok) {
          const { skills: rawSkills } = await skillsRes.json();
          const mentorMap = new Map<string, RequestMentorOption>();
          const loadedSkills: RequestSkillOption[] = [];

          rawSkills.forEach((s: any) => {
            if (!s.users) return;
            
            // Extract Mentor
            if (!mentorMap.has(s.users.id)) {
              mentorMap.set(s.users.id, {
                id: s.users.id,
                name: s.users.name || "Unknown",
                department: s.users.department || "Unknown",
              });
            }
            
            // Extract Skill
            loadedSkills.push({
              id: s.id,
              mentorId: s.users.id,
              name: s.title,
              level: s.level,
            });
          });

          setMentors(Array.from(mentorMap.values()));
          setSkills(loadedSkills);
        }

        // 3. Load requests (sent and received)
        const reqRes = await fetch("/api/requests");
        if (reqRes.ok) {
          const { requests: rawReqs } = await reqRes.json();
          
          const mySentRequests = rawReqs.filter((r: any) => r.sender?.id === user.id);
          const myIncoming = rawReqs.filter((r: any) => r.receiver?.id === user.id);
          
          const mapRequest = (r: any, isIncoming: boolean): LearningRequest => ({
            id: r.id,
            mentorName: isIncoming ? (r.sender?.name || "User") : (r.receiver?.name || "Mentor"),
            mentorDepartment: isIncoming ? "" : (r.receiver?.department || ""),
            skillName: r.skills?.title || "Skill",
            mode: "online", // Mock data fallback as mode doesn't exist in DB
            proposedDate: new Date(r.created_at).toISOString().split("T")[0],
            proposedTime: new Date(r.created_at).toTimeString().substring(0, 5),
            location: "",
            message: r.message || "",
            status: r.status,
          });
          
          setRequests(mySentRequests.map((r: any) => mapRequest(r, false)));
          setIncomingRequests(myIncoming.map((r: any) => mapRequest(r, true)));
        }

      } catch (err) {
        // ignore
      }
    }
    loadData();
  }, []);

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) =>
          new Date(`${b.proposedDate}T${b.proposedTime}`).getTime() -
          new Date(`${a.proposedDate}T${a.proposedTime}`).getTime()
      ),
    [requests]
  );

  const sortedIncoming = useMemo(
    () =>
      [...incomingRequests].sort(
        (a, b) =>
          new Date(`${b.proposedDate}T${b.proposedTime}`).getTime() -
          new Date(`${a.proposedDate}T${a.proposedTime}`).getTime()
      ),
    [incomingRequests]
  );

  function mentorNameById(mentorId: string) {
    return mentors.find((m) => m.id === mentorId)?.name ?? "Mentor";
  }

  function mentorDepartmentById(mentorId: string) {
    return mentors.find((m) => m.id === mentorId)?.department ?? "";
  }

  function skillNameById(skillId: string) {
    return skills.find((s) => s.id === skillId)?.name ?? "Skill";
  }

  async function handleSubmitRequest(values: RequestFormValues) {
    if (!currentUser) return;

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: values.mentorId,
          skillId: values.skillId,
          message: values.message,
        }),
      });

      if (res.ok) {
        const { request } = await res.json();
        
        const newRequest: LearningRequest = {
          id: request.id,
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
    } catch {
      // ignore
    }
  }

  async function handleCancelRequest(request: LearningRequest) {
    try {
      const res = await fetch(`/api/requests/${request.id}`, { method: "DELETE" });
      if (res.ok) {
        setRequests((prev) => prev.filter((item) => item.id !== request.id));
      }
    } catch {
      // ignore
    }
  }

  async function handleUpdateIncomingStatus(request: LearningRequest, newStatus: string) {
    try {
      const res = await fetch(`/api/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setIncomingRequests((prev) =>
          prev.map((r) => (r.id === request.id ? { ...r, status: newStatus as any } : r))
        );
      } else {
        const errorData = await res.json();
        alert(`Gagal update: ${errorData.error || "Kesalahan server"}`);
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan jaringan: ${err.message}`);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search learning requests..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Learning Requests
              </h1>
              <p className="text-sm text-muted-foreground">
                Kelola permintaan belajarmu
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <Card className="shadow-card lg:col-span-2">
                <CardContent className="p-5">
                  <h2 className="mb-4 text-md font-semibold text-foreground">
                    Kirim Request Baru
                  </h2>
                  <RequestForm
                    mentors={mentors}
                    skills={skills}
                    onSubmit={handleSubmitRequest}
                  />
                </CardContent>
              </Card>

              <section className="space-y-6 lg:col-span-3">
                {/* Incoming Requests */}
                <div>
                  <div>
                    <h2 className="text-md font-semibold text-foreground">
                      Request Masuk
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Permintaan belajar dari pengguna lain
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {sortedIncoming.length === 0 ? (
                      <p className="col-span-full text-sm text-muted-foreground italic">Belum ada request masuk.</p>
                    ) : (
                      sortedIncoming.map((req) => (
                        <Card key={req.id} className="shadow-sm">
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <p className="font-semibold text-sm">{req.mentorName}</p>
                              <p className="text-xs text-muted-foreground">ingin belajar {req.skillName}</p>
                            </div>
                            {req.message && <p className="text-xs border-l-2 pl-2 text-foreground/80">{req.message}</p>}
                            {req.status === "pending" ? (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" onClick={() => handleUpdateIncomingStatus(req, "accepted")} className="flex-1">Terima</Button>
                                <Button size="sm" variant="outline" onClick={() => handleUpdateIncomingStatus(req, "rejected")} className="flex-1 text-destructive">Tolak</Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                                <Badge variant={req.status === "accepted" ? "success" : "destructive"}>
                                  {req.status.toUpperCase()}
                                </Badge>
                                {req.status === "accepted" && (
                                  <Button size="sm" variant="ghost" onClick={() => window.location.href = "/chat"}>
                                    <MessageSquare className="h-4 w-4 mr-1" /> Chat
                                  </Button>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                {/* Sent Requests */}
                <div>
                  <div>
                    <h2 className="text-md font-semibold text-foreground">
                      Riwayat Request Terkirim
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {sortedRequests.length} request yang pernah kamu kirim
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {sortedRequests.length === 0 ? (
                      <p className="col-span-full text-sm text-muted-foreground italic">Belum ada request terkirim.</p>
                    ) : (
                      sortedRequests.map((request) => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          onCancel={handleCancelRequest}
                          onOpenChat={() => window.location.href = "/chat"}
                        />
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}