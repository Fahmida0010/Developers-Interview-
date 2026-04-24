"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/src/lib/supabase";
import Swal from "sweetalert2";

interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

interface FriendRequest {
  id: string;
  user_id: string;
  status: string;
  sender_info: User;
}

export default function PeoplePage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch all users
    const { data: allUsers, error: userError } = await supabase.from("users").select("*");
    
    // 2. Fetch my sent requests to disable "Add Friend" button
    const { data: sentReqs } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", session?.user?.id);

    // 3. Fetch incoming pending requests
    const { data: incoming } = await supabase
      .from("friends")
      .select(`id, user_id, status, users!friends_user_id_fkey(id, name, email, image)`)
      .eq("friend_id", session?.user?.id)
      .eq("status", "pending");

    if (allUsers) {
      const filtered = allUsers.filter((u: User) => u.email !== session?.user?.email);
      setUsers(filtered);
    }

    if (sentReqs) {
      setRequested(sentReqs.map(r => r.friend_id));
    }

    if (incoming) {
      const formattedIncoming = incoming.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        status: item.status,
        sender_info: item.users
      }));
      setIncomingRequests(formattedIncoming);
    }

    setLoading(false);
  };

  const handleAddFriend = async (friendId: string) => {
    if (!session?.user?.id) {
      Swal.fire("Error", "User not logged in", "error");
      return;
    }

    const { error } = await supabase.from("friends").insert([
      { user_id: session.user.id, friend_id: friendId, status: "pending" },
    ]);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    setRequested((prev) => [...prev, friendId]);
    Swal.fire({ icon: "success", title: "Request Sent!", timer: 2000, showConfirmButton: false });
  };

  const handleRequestAction = async (requestId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from("friends")
      .update({ status })
      .eq("id", requestId);

    if (!error) {
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      Swal.fire("Success", `Request ${status}`, "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-white p-4 sm:p-6">
      
      {/* Pending Requests Section */}
      {incomingRequests.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-[#00a884]">Friend Requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomingRequests.map((req) => (
              <div key={req.id} className="bg-[#202c33] p-4 rounded-xl flex items-center gap-4 border border-[#00a884]/30">
                <img src={req.sender_info.image || "/avatar.png"} className="w-12 h-12 rounded-full object-cover" alt="user" />
                <div className="flex-1">
                  <h3 className="font-medium">{req.sender_info.name || req.sender_info.email}</h3>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleRequestAction(req.id, 'accepted')} className="bg-[#00a884] text-xs px-3 py-1 rounded">Accept</button>
                    <button onClick={() => handleRequestAction(req.id, 'rejected')} className="bg-red-500 text-xs px-3 py-1 rounded">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Suggestions</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const isRequested = requested.includes(user.id);
            return (
              <div key={user.id} className="bg-[#202c33] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-md">
                <img src={user.image || "/avatar.png"} className="w-12 h-12 rounded-full object-cover" alt="user" />
                <div className="flex-1">
                  <h3 className="font-medium">{user.name || user.email}</h3>
                  <p className="text-sm text-gray-400 break-all">{user.email}</p>
                </div>
                <div className="flex sm:flex-col gap-2 sm:ml-auto w-full sm:w-auto">
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    disabled={isRequested}
                    className={`px-3 py-1 rounded text-sm transition w-full sm:w-auto ${
                      isRequested ? "bg-gray-600 cursor-not-allowed" : "bg-[#00a884] hover:bg-[#06cf9c]"
                    }`}
                  >
                    {isRequested ? "Requested" : "Add Friend"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}