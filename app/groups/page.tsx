import { Users, Hash, MoreVertical, MessageCircle } from "lucide-react";

export default function GroupsPage() {
  const groups = [
    { id: 1, name: "Next.js Developers BD", members: "1.2k", lastMsg: "New version released!" },
    { id: 2, name: "MERN Stack Bootcamp", members: "45", lastMsg: "Assignment deadline tonight" },
    { id: 3, name: "Job Interview Prep", members: "150", lastMsg: "Mock interview starts at 9pm" },
  ];

  return (
    <div className="flex h-full w-full bg-[#111b21]">
      {/* Group Sidebar */}
      <div className="w-full md:w-[350px] border-r border-gray-700 flex flex-col">
        <div className="p-4 bg-[#202c33] flex justify-between items-center text-[#e9edef]">
          <h1 className="text-xl font-bold">Groups</h1>
          <Users size={20} className="cursor-pointer" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center p-4 hover:bg-[#2a3942] cursor-pointer border-b border-[#202c33]">
              <div className="w-12 h-12 rounded-full bg-[#374248] flex items-center justify-center text-green-500 mr-3">
                <Hash size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-[#e9edef] font-medium">{group.name}</h3>
                  <span className="text-[10px] text-gray-500">{group.members} members</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{group.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Chat Empty State */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#222e35] text-center p-6">
        <div className="bg-[#2a3942] p-6 rounded-full mb-4">
          <MessageCircle size={60} className="text-[#8696a0]" />
        </div>
        <h2 className="text-[#e9edef] text-2xl font-light">Select a Group</h2>
        <p className="text-[#8696a0] max-w-xs mt-2">Join community groups to discuss projects and practice interviews with others.</p>
        <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition">
          Create New Group
        </button>
      </div>
    </div>
  );
}