"use client";

import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ConversationList,
} from "@/components/chat/ConversationList";
import type { Conversation } from "@/components/chat/ConversationItem";

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    mentorName: "Dimas Pratama",
    mentorDepartment: "Teknik Informatika",
    isOnline: true,
    lastMessage: "Oke, kita mulai jam 7 malam ya. Jangan lupa siapkan laptop.",
    lastMessageAt: "2026-07-04T09:45:00",
    unreadCount: 2,
  },
  {
    id: "conv-2",
    mentorName: "Sari Dewi",
    mentorDepartment: "Sastra Inggris",
    isOnline: false,
    lastMessage: "Terima kasih sudah konfirmasi lokasinya!",
    lastMessageAt: "2026-07-04T07:10:00",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    mentorName: "Rina Kusuma",
    mentorDepartment: "Desain Komunikasi Visual",
    isOnline: true,
    lastMessage: "Aku kirimkan referensi desainnya di sini nanti malam",
    lastMessageAt: "2026-07-03T20:22:00",
    unreadCount: 5,
  },
  {
    id: "conv-4",
    mentorName: "Bayu Aditya",
    mentorDepartment: "Manajemen",
    isOnline: false,
    lastMessage: "Sesi kita sudah selesai, semoga bermanfaat ya!",
    lastMessageAt: "2026-07-02T15:00:00",
    unreadCount: 0,
  },
];

export default function ChatPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [conversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] =
    useState<string | undefined>(initialConversations[0]?.id);

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
      ),
    [conversations]
  );

  const activeConversation = useMemo(
    () =>
      sortedConversations.find(
        (conversation) => conversation.id === activeConversationId
      ),
    [sortedConversations, activeConversationId]
  );

  function handleSelectConversation(conversation: Conversation) {
    setActiveConversationId(conversation.id);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={() => setIsDrawerOpen(true)} searchPlaceholder="Search conversations..." />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">Chat</h1>
              <p className="text-sm text-muted-foreground">
                Percakapan real-time dengan mentor dan learner kamu
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <Card className="shadow-card lg:col-span-2">
                <CardContent className="p-3">
                  <ConversationList
                    conversations={sortedConversations}
                    activeConversationId={activeConversationId}
                    onSelect={handleSelectConversation}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-card lg:col-span-3">
                <CardContent className="flex h-[560px] flex-col items-center justify-center gap-3 p-5 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </span>
                  {activeConversation ? (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activeConversation.mentorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ruang chat akan ditampilkan di sini
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Pilih percakapan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pilih salah satu percakapan di sebelah kiri untuk mulai chat
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}