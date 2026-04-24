"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Video,
  Users,
  Bot,
  Settings,
  LogIn,
  LogOut,
  Sun,
  Moon,
  ShieldAlert,
  ChevronUp,
  UserRound,
  UserPlus,
} from "lucide-react";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { supabase } from "@/src/lib/supabase";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (session?.user?.id) {
      fetchRequestCount();
      
      // Realtime listener for new requests
      const channel = supabase
        .channel('friend-requests')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'friends', filter: `friend_id=eq.${session.user.id}` }, 
          () => fetchRequestCount()
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [session]);

  const fetchRequestCount = async () => {
    const { count, error } = await supabase
      .from("friends")
      .select("*", { count: 'exact', head: true })
      .eq("friend_id", session?.user?.id)
      .eq("status", "pending");
    
    if (!error) setRequestCount(count || 0);
  };

  if (!mounted) return null;

  const navItems: NavItem[] = [
    { icon: <MessageSquare size={24} />, label: "Chats", href: "/chat" },
    { icon: <Video size={24} />, label: "Interviews", href: "/interview" },
    { 
      icon: (
        <div className="relative">
          <UserRound size={24} />
          {requestCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {requestCount}
            </span>
          )}
        </div>
      ), 
      label: "People", 
      href: "/people" 
    },
    { icon: <Users size={24} />, label: "Groups", href: "/groups" },
    { icon: <Bot size={24} />, label: "AI Assistant", href: "/ai-chat" },
  ];

  return (
    <nav className="h-screen w-16 md:w-20 bg-black dark:bg-[#202c33] flex flex-col items-center py-4 justify-between border-r border-gray-200 dark:border-gray-700 relative transition-colors duration-300">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-8">
        <Link href="/" className="flex flex-col items-center">
          <img
            src="/square.jpg"
            alt="Logo"
            className="w-10 h-10 object-contain hover:scale-110 transition-transform cursor-pointer rounded-lg"
          />
          <span className="text-[13px] text-blue-500 dark:text-[#aebac1] font-medium text-center leading-tight">
            DevChat
          </span>
        </Link>

        <div className="flex flex-col gap-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              title={item.label}
              className="text-gray-500 dark:text-[#aebac1] hover:text-black dark:hover:text-white transition-colors p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#374248]"
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 mt-auto mb-2 relative">
        <Link
          href="/settings"
          className="text-gray-500 dark:text-[#aebac1] hover:text-black dark:hover:text-white p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#374248]"
        >
          <Settings size={24} />
        </Link>

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-500 dark:text-[#aebac1] hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#374248]"
        >
          <ChevronUp
            size={20}
            className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-16 left-14 w-48 bg-white dark:bg-[#233138] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50">
            <button onClick={() => setTheme("light")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${theme === "light" ? "text-[#00a884] bg-gray-50 dark:bg-[#111b21]" : "text-gray-700 dark:text-[#d1d7db]"}`}>
              <Sun size={18} /> Light Mode
            </button>
            <button onClick={() => setTheme("dark")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${theme === "dark" ? "text-[#00a884] bg-gray-50 dark:bg-[#111b21]" : "text-gray-700 dark:text-[#d1d7db]"}`}>
              <Moon size={18} /> Dark Mode
            </button>
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
            <Link href="/blocked-members" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-[#d1d7db]">
              <ShieldAlert size={18} /> Blocked Members
            </Link>
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
            {session ? (
              <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/login" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#00a884]">
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        )}

        {session ? (
          <Link href="/profile">
            <img
              src={session.user?.image || "/default-avatar.png"}
              className="w-10 h-10 rounded-full border-2 border-transparent hover:border-[#00a884] cursor-pointer"
            />
          </Link>
        ) : (
          <Link href="/login" className="text-[#00a884] p-3">
            <LogIn size={24} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;