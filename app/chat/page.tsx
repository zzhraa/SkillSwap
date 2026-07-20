"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { ConversationList } from "@/components/chat/ConversationList";
import type { Conversation } from "@/components/chat/ConversationItem";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Message } from "@/components/chat/MessageBubble";
import { createBrowserClient } from "@supabase/ssr";

export default function ChatPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);

  // 1. Inisialisasi Supabase Client buat Realtime
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // 2. Load User & Daftar Conversation
  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) return;
        const { user } = await meRes.json();
        setCurrentUser(user);

        const convRes = await fetch("/api/conversations");
        if (convRes.ok) {
          const { conversations: rawConvs } = await convRes.json();
          const loaded: Conversation[] = (rawConvs || []).map((c: any) => {
            const req = c.requests;
            const otherUser = req?.sender?.id === user.id ? req?.receiver : req?.sender;
            
            // Sort messages locally to find the latest one if it exists
            const sortedMsgs = c.messages?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            const lastMsg = sortedMsgs?.[0];
            
            return {
              id: c.id,
              mentorName: otherUser?.name || "Unknown",
              mentorDepartment: "",
              isOnline: false,
              lastMessage: lastMsg ? lastMsg.message : "Belum ada pesan",
              lastMessageAt: lastMsg ? lastMsg.created_at : c.created_at,
              unreadCount: 0,
            };
          });
          setConversations(loaded);
        }
      } catch (err) {
        // Abaikan
      }
    }
    init();
  }, []);

  // Sort dari yang paling baru
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
    () => sortedConversations.find((c) => c.id === activeConversationId),
    [sortedConversations, activeConversationId]
  );

  // 3. Load Messages ketika Room dipilih, & pasang Realtime
  useEffect(() => {
    if (!activeConversationId || !currentUser) return;

    // Load History
    fetch(`/api/conversations/${activeConversationId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          const formatted: Message[] = data.messages.map((m: any) => ({
            id: m.id,
            content: m.message,
            senderId: m.sender?.id || m.sender_id, // Adjusting in case join is populated
            createdAt: m.created_at,
            // status: "sent",
            isRead: true,
          }));
          setMessages(formatted.reverse()); // Supabase default sort desc, kita reverse buat UI (dari atas ke bawah)
        }
      });

    // Realtime Subscription
    const channel = supabase
      .channel(`room_${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              content: newMsg.message,
              senderId: newMsg.sender_id,
              createdAt: newMsg.created_at,
              // status: "sent",
              isRead: false,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, currentUser, supabase]);

  function handleSelectConversation(conversation: Conversation) {
    setActiveConversationId(conversation.id);
  }

  // 4. Handle Kirim Pesan
  async function handleSendMessage(content: string) {
    if (!activeConversationId || !currentUser || !content.trim()) return;

    try {
      await fetch(`/api/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      // Realtime listener yang akan nerima data balikan dari database & nge-replace pesan
    } catch {
      // Error handling jika gagal kirim
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isDrawerOpen && (
        <MobileDrawer onClose={() => setIsDrawerOpen(false)} />
      )}
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
                {activeConversation && currentUser ? (
                  <ChatWindow
                    mentorName={activeConversation.mentorName}
                    mentorDepartment={activeConversation.mentorDepartment}
                    isOnline={activeConversation.isOnline}
                    currentUserId={currentUser.id}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                ) : (
                  <CardContent className="flex h-[560px] flex-col items-center justify-center gap-3 p-5 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
                      <MessageSquare className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Pilih percakapan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pilih salah satu percakapan di sebelah kiri untuk mulai chat
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}