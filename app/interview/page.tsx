import { Video, Phone, Plus } from "lucide-react";

export default function InterviewPage() {
  const calls = [
    { id: 1, name: "Technical Interview - Google", type: "Video", date: "Today, 2:00 PM" },
    { id: 2, name: "HR Round", type: "Audio", date: "Yesterday, 11:00 AM" },
  ];

  return (
    <div className="p-6 bg-[#111b21] h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Interviews</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <Plus size={18} /> New Call
        </button>
      </div>

      <div className="space-y-4">
        {calls.map((call) => (
          <div key={call.id} className="bg-[#202c33] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gray-700 p-3 rounded-full text-green-500">
                {call.type === "Video" ? <Video size={24} /> : <Phone size={24} />}
              </div>
              <div>
                <h3 className="text-white font-semibold">{call.name}</h3>
                <p className="text-gray-400 text-sm">{call.date}</p>
              </div>
            </div>
            <button className="text-green-500 border border-green-500 px-4 py-1 rounded-lg hover:bg-green-500 hover:text-white transition">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}