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
  friend_id: string;
  status: string;
  sender_info?: User;
}

export default function PeoplePage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [requestedIds, setRequestedIds] = useState<string[]>([]); // To track pending sent requests
  const [loading, setLoading] = useState(true);

  const myId = session?.user?.id;

  useEffect(() => {
    if (myId) {
      fetchData();
    }
  }, [myId]);

  const fetchData = async () => {
    if (!myId) return;
    setLoading(true);

    try {
      // 1. Fetch All Users
      const { data: allUsers } = await supabase.from("users").select("*");

      // 2. Fetch All Relations (Pending and Accepted) involving me
      const { data: relations } = await supabase
        .from("friends")
        .select("*")
        .or(`user_id.eq.${myId},friend_id.eq.${myId}`);

      const pendingSent: string[] = [];
      const pendingReceived: FriendRequest[] = [];
      const acceptedFriendIds: string[] = [];

      if (relations) {
        relations.forEach((rel) => {
          if (rel.status === "accepted") {
            acceptedFriendIds.push(rel.user_id === myId ? rel.friend_id : rel.user_id);
          } else if (rel.status === "pending") {
            if (rel.user_id === myId) {
              pendingSent.push(rel.friend_id);
            } else {
              pendingReceived.push(rel);
            }
          }
        });
      }

      // 3. Fetch details for incoming requests
      let formattedIncoming: FriendRequest[] = [];
      if (pendingReceived.length > 0) {
        const senderIds = pendingReceived.map((r) => r.user_id);
        const { data: senders } = await supabase
          .from("users")
          .select("*")
          .in("id", senderIds);

        formattedIncoming = pendingReceived.map((req) => ({
          ...req,
          sender_info: senders?.find((u) => u.id === req.user_id),
        }));
      }

      // 4. Filter Suggestion List
      // Logic: Me + Friends + People I requested + People who requested me = Hide from suggestions
      const hideIds = [myId, ...acceptedFriendIds, ...pendingSent, ...pendingReceived.map(r => r.user_id)];

      if (allUsers) {
        setUsers(allUsers.filter((u) => !hideIds.includes(u.id)));
      }

      setRequestedIds(pendingSent);
      setIncomingRequests(formattedIncoming);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    if (!myId) return;

    const { error } = await supabase.from("friends").insert([
      {
        user_id: myId,
        friend_id: friendId,
        status: "pending",
      },
    ]);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    await fetchData();
    Swal.fire("Success", "Request Sent!", "success");
  };

  const handleRequestAction = async (request: FriendRequest, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("friends")
      .update({ status })
      .eq("id", request.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    if (status === "accepted") {
      // Chat table e entry (optional if you handle chats differently)
      await supabase.from("conversations").insert({
        user1_id: request.user_id,
        user2_id: request.friend_id,
      });
    }

    await fetchData();
    Swal.fire("Success", `Request ${status}`, "success");
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-white p-4 sm:p-6">
      {/* Friend Requests Section */}
      {incomingRequests.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-[#00a884]">Incoming Friend Requests</h2>
          <div className="grid gap-4">
            {incomingRequests.map((req) => (
              <div key={req.id} className="bg-[#202c33] p-4 rounded-xl flex items-center gap-4">
                <img
                  src={req.sender_info?.image || "/avatar.png"}
                  alt="user"
                  className="w-14 h-14 rounded-full border-2 border-[#00a884]"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{req.sender_info?.name || "Unknown"}</h3>
                  <p className="text-sm text-gray-400">{req.sender_info?.email}</p>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleRequestAction(req, "accepted")}
                      className="bg-[#00a884] hover:bg-[#06cf9c] px-4 py-1 rounded font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequestAction(req, "rejected")}
                      className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded font-medium"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      <h1 className="text-2xl font-bold mb-6">People you may know</h1>
      {loading ? (
        <p className="text-gray-400">Loading suggestions...</p>
      ) : (
        <div className="grid gap-4">
          {users.length === 0 && <p className="text-gray-500">No new suggestions found.</p>}
          {users.map((user) => {
            const isRequested = requestedIds.includes(user.id);

            return (
              <div key={user.id} className="bg-[#202c33] p-4 rounded-xl flex items-center gap-4">
                <img
                  src={user.image || "/avatar.png"}
                  alt="user"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{user.name || "No Name"}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => handleAddFriend(user.id)}
                  disabled={isRequested}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    isRequested
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-[#00a884] hover:bg-[#06cf9c] text-white"
                  }`}
                >
                  {isRequested ? "Request Sent" : "Add Friend"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}