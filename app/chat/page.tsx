import React from 'react';
import { Search, Filter } from 'lucide-react';

const ChatPage = () => {
  // Demo data for visual testing
  const chats = [
    { id: 1, name: "Forhad Miah", lastMsg: "Project update ta pathan", time: "10:30 AM" },
    { id: 2, name: "AI Interviewer", lastMsg: "Ready for the mock test?", time: "Yesterday" },
    { id: 3, name: "Dev Team", lastMsg: "Socket.io issue fixed", time: "9:15 AM" },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-[400px] border-r border-gray-700 bg-[#111b21] flex flex-col">
        {/* Header */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-[#e9edef]">Chats</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex items-center bg-[#202c33] rounded-lg px-3 py-1.5">
            <Search size={18} className="text-[#8696a0] mr-2" />
            <input 
              type="text" 
              placeholder="Search or start new chat"
              className="bg-transparent border-none outline-none text-sm text-[#d1d7db] w-full"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className="flex items-center p-3 hover:bg-[#2a3942] cursor-pointer border-b border-[#202c33]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-600 mr-3 flex-shrink-0" />
              <div className="flex-1 border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-[#e9edef] font-medium">{chat.name}</h3>
                  <span className="text-xs text-[#8696a0]">{chat.time}</span>
                </div>
                <p className="text-sm text-[#8696a0] truncate mt-0.5">{chat.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for Message Window */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-[#222e35]">
        <div className="text-center">
          <h2 className="text-[#e9edef] text-2xl font-light">WhatsApp for Interviews</h2>
          <p className="text-[#8696a0] text-sm mt-2">Send and receive messages without keeping your phone online.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;