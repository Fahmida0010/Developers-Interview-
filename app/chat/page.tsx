"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Chat = {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
  typing: boolean;
};

const ChatPage = () => {
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  // 🔹 Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // 🔹 Fetch Chats (ONLY accepted friends)
  useEffect(() => {
    if (!user) return;
    fetchChats();
    subscribeRealtime();
  }, [user]);

  const fetchChats = async () => {
    // 1. Get conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (!conversations) return;

    // 2. Get other users
    const otherIds = conversations.map((c) =>
      c.user1_id === user.id ? c.user2_id : c.user1_id
    );

    const { data: users } = await supabase
      .from("users")
      .select("*")
      .in("id", otherIds);

    // 3. Get last messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .in(
        "conversation_id",
        conversations.map((c) => c.id)
      )
      .order("created_at", { ascending: false });

    // 4. Build chat list
    const chatList: Chat[] = conversations.map((conv) => {
      const otherId =
        conv.user1_id === user.id ? conv.user2_id : conv.user1_id;

      const userInfo = users?.find((u) => u.id === otherId);

      const lastMsg = messages?.find(
        (m) => m.conversation_id === conv.id
      );

      const unreadCount =
        messages?.filter(
          (m) =>
            m.conversation_id === conv.id &&
            m.sender_id !== user.id &&
            !m.read
        ).length || 0;

      return {
        id: conv.id,
        name: userInfo?.name || "Unknown",
        lastMsg: lastMsg?.text || "No messages yet",
        time: lastMsg
          ? new Date(lastMsg.created_at).toLocaleTimeString()
          : "",
        unread: unreadCount,
        typing: false,
      };
    });

    setChats(chatList);
  };

  // 🔥 Realtime updates (messages + typing)
  const subscribeRealtime = () => {
    // New messages
    supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => fetchChats()
      )
      .subscribe();

    // Typing indicator
    supabase
      .channel("typing")
      .on("broadcast", { event: "typing" }, (payload: any) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === payload.payload.conversation_id
              ? { ...chat, typing: payload.payload.typing }
              : chat
          )
        );
      })
      .subscribe();
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] border-r border-gray-700 bg-[#111b21] flex flex-col">
        
        {/* Header */}
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-[#e9edef]">Chats</h1>

          {/* Search */}
          <div className="relative flex items-center bg-[#202c33] rounded-lg px-3 py-1.5">
            <Search size={18} className="text-[#8696a0] mr-2" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent outline-none text-sm text-[#d1d7db] w-full"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="flex items-center p-3 hover:bg-[#2a3942] cursor-pointer border-b border-[#202c33]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-600 mr-3" />

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-[#e9edef] font-medium">
                    {chat.name}
                  </h3>

                  <span className="text-xs text-[#8696a0]">
                    {chat.time}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-[#8696a0] truncate">
                    {chat.typing ? "Typing..." : chat.lastMsg}
                  </p>

                  {chat.unread > 0 && (
                    <span className="bg-green-500 text-xs px-2 py-0.5 rounded-full text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-[#222e35]">
        <h2 className="text-[#e9edef] text-xl">
          Select a chat to start messaging
        </h2>
      </div>
    </div>
  );
};

export default ChatPage;