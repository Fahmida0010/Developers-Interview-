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
  const [loading, setLoading] = useState(true);
  const [requested, setRequested] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);

    const myId = session?.user?.id;

    // 🔹 All users
    const { data: allUsers } = await supabase.from("users").select("*");

    // 🔹 Sent requests
    const { data: sentReqs } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", myId);

    // 🔹 Incoming requests
    const { data: incoming } = await supabase
      .from("friends")
      .select("*")
      .eq("friend_id", myId)
      .eq("status", "pending");

    // 🔥 format incoming with sender info
    let formattedIncoming: FriendRequest[] = [];

    if (incoming && incoming.length > 0) {
      const senderIds = incoming.map((i) => i.user_id);

      const { data: senders } = await supabase
        .from("users")
        .select("*")
        .in("id", senderIds);

      formattedIncoming = incoming.map((req: any) => ({
        ...req,
        sender_info: senders?.find((u) => u.id === req.user_id),
      }));
    }

    // 🔹 Filter users (exclude self)
    if (allUsers && myId) {
      setUsers(allUsers.filter((u) => String(u.id) !== String(myId)));
    }

    // 🔹 Requested list
    const sentList = sentReqs?.map((r) => r.friend_id) || [];
    const incomingIds = incoming?.map((r) => r.user_id) || [];

    setRequested([...sentList, ...incomingIds]);
    setIncomingRequests(formattedIncoming);

    setLoading(false);
  };

  // 🔥 Send Friend Request
  const handleAddFriend = async (friendId: string) => {
    const { error } = await supabase.from("friends").insert([
      {
        user_id: session?.user?.id,
        friend_id: friendId,
        status: "pending",
      },
    ]);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    setRequested((prev) => [...prev, friendId]);

    Swal.fire("Success", "Request Sent!", "success");
  };

  // 🔥 Accept / Reject
  const handleRequestAction = async (
    request: FriendRequest,
    status: "accepted" | "rejected"
  ) => {
    const { error } = await supabase
      .from("friends")
      .update({ status })
      .eq("id", request.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
      return;
    }

    // 🔥 create conversation if accepted
    if (status === "accepted") {
      await supabase.from("conversations").insert({
        user1_id: request.user_id,
        user2_id: request.friend_id,
      });
    }

    setIncomingRequests((prev) =>
      prev.filter((r) => r.id !== request.id)
    );

    Swal.fire("Success", `Request ${status}`, "success");
  };

  return (
    <div className="min-h-screen bg-[#111b21] text-white p-4 sm:p-6">

      {/* 🔥 Incoming Requests */}
      {incomingRequests.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-[#00a884]">
            Friend Requests
          </h2>

          <div className="grid gap-4">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#202c33] p-4 rounded-xl flex items-center gap-4"
              >
                <img
                  src={req.sender_info?.image || "/avatar.png"}
                  className="w-14 h-14 rounded-full"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {req.sender_info?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {req.sender_info?.email}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() =>
                        handleRequestAction(req, "accepted")
                      }
                      className="bg-green-500 px-4 py-1 rounded"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        handleRequestAction(req, "rejected")
                      }
                      className="bg-red-500 px-4 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Users */}
      <h1 className="text-2xl font-bold mb-6">Suggestions</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => {
            const isRequested = requested.includes(user.id);

            return (
              <div
                key={user.id}
                className="bg-[#202c33] p-4 rounded-xl flex items-center gap-4"
              >
                <img
                  src={user.image || "/avatar.png"}
                  className="w-12 h-12 rounded-full"
                />

                <div className="flex-1">
                  <h3>{user.name || "No Name"}</h3>
                  <p className="text-sm text-gray-400">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => handleAddFriend(user.id)}
                  disabled={isRequested}
                  className={`px-3 py-1 rounded text-sm ${
                    isRequested
                      ? "bg-gray-600"
                      : "bg-[#00a884] hover:bg-[#06cf9c]"
                  }`}
                >
                  {isRequested ? "Requested" : "Add Friend"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}