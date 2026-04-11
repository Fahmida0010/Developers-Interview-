export default function StatusPage() {
  return (
    <div className="p-6 bg-[#111b21] h-full flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full border-2 border-green-500 p-1 mb-4">
        <div className="w-full h-full bg-gray-600 rounded-full overflow-hidden" />
      </div>
      <h2 className="text-white text-xl font-bold">My Status</h2>
      <p className="text-gray-400 text-sm mt-1">Tap to add status update</p>
      
      <div className="mt-10 w-full max-w-md">
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">Recent Updates</h3>
        <div className="text-gray-400 italic text-center py-10 bg-[#202c33] rounded-lg">
          No status updates yet.
        </div>
      </div>
    </div>
  );
}