"use client";
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Video, CircleDashed, Users, 
  Bot, Settings, LogIn, LogOut, Sun, Moon, ShieldAlert, ChevronUp 
} from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    { icon: <MessageSquare size={24} />, label: 'Chats', href: '/chat' },
    { icon: <Video size={24} />, label: 'Interviews', href: '/interview' },
    { icon: <CircleDashed size={24} />, label: 'Status', href: '/status' },
    { icon: <Users size={24} />, label: 'Groups', href: '/groups' },
    { icon: <Bot size={24} />, label: 'AI Assistant', href: '/ai-chat' },
  ];

  if (!mounted) return null;

  return (
    <nav className="h-screen w-16 md:w-20 bg-black dark:bg-[#202c33] flex flex-col items-center py-4 justify-between border-r border-gray-200 dark:border-gray-700 relative transition-colors duration-300">
      
      {/* Top Section: Logo & Nav Items */}
      <div className="flex flex-col items-center gap-8">
        <Link href="/">
          <img 
            src="/square.jpg" 
            alt="Logo" 
            className="w-10 h-10 object-contain hover:scale-110 transition-transform cursor-pointer rounded-lg" 
          />
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
      
      {/* Bottom Section: Dropdown & Profile */}
      <div className="flex flex-col items-center gap-4 mt-auto mb-2 relative">
        
        <Link 
          href="/settings" 
          title="Settings"
          className="text-gray-500 dark:text-[#aebac1] hover:text-black dark:hover:text-white p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#374248]"
        >
          <Settings size={24} />
        </Link>

        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-500 dark:text-[#aebac1] hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#374248] transition-all"
        >
          <ChevronUp size={20} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute bottom-16 left-14 w-48 bg-white dark:bg-[#233138] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
            
            <button 
              onClick={() => setTheme('light')}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${theme === 'light' ? 'text-[#00a884] bg-gray-50 dark:bg-[#111b21]' : 'text-gray-700 dark:text-[#d1d7db] hover:bg-gray-100 dark:hover:bg-[#111b21]'}`}
            >
              <Sun size={18} /> Light Mode
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${theme === 'dark' ? 'text-[#00a884] bg-gray-50 dark:bg-[#111b21]' : 'text-gray-700 dark:text-[#d1d7db] hover:bg-gray-100 dark:hover:bg-[#111b21]'}`}
            >
              <Moon size={18} /> Dark Mode
            </button>

            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
            
            <Link href="/blocked-members" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-[#d1d7db] hover:bg-gray-100 dark:hover:bg-[#111b21] transition-colors">
              <ShieldAlert size={18} /> Blocked Members
            </Link>
            
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
            
            {session ? (
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-[#111b21] transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/login" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#00a884] hover:bg-gray-100 dark:hover:bg-[#111b21] transition-colors">
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        )}

        {/* Profile/Login */}
        {session ? (
          <div className="relative group">
            <img 
              src={session.user?.image || "/default-avatar.png"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-[#00a884] transition cursor-pointer shadow-sm"
            />
          </div>
        ) : (
          <Link 
            href="/login" 
            title="Login"
            className="text-[#00a884] hover:bg-[#00a884]/10 p-3 rounded-xl transition-colors"
          >
            <LogIn size={24} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;