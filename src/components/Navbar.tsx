import React from 'react';
import { MessageSquare, Video, CircleDashed, Users, Bot, Settings } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const navItems = [
    { icon: <MessageSquare size={24} />, label: 'Chats', href: '/chat' },
    { icon: <Video size={24} />, label: 'Interviews', href: '/interview' },
    { icon: <CircleDashed size={24} />, label: 'Status', href: '/status' },
    { icon: <Users size={24} />, label: 'Groups', href: '/groups' },
    { icon: <Bot size={24} />, label: 'AI Assistant', href: '/ai-chat' },
  ];

  return (
    <nav className="h-screen w-16 md:w-20 bg-[#202c33] flex flex-col items-center py-4 justify-between border-r border-gray-700">
      <div className="flex flex-col gap-8">
        {navItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href} 
            title={item.label}
            className="text-[#aebac1] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#374248]"
          >
            {item.icon}
          </Link>
        ))}
      </div>
      
      <div className="mt-auto">
        <Link 
          href="/settings" 
          className="text-[#aebac1] hover:text-white p-2 rounded-lg hover:bg-[#374248]"
        >
          <Settings size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;