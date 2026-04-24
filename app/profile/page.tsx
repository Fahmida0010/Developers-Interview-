"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("/default-avatar.png");

  // ✅ session load হলে state update
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPreview(session.user.image || "/default-avatar.png");
    }
  }, [session]);

  // 📸 image select
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🚀 submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/profile-update", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {/* 🔥 বর্তমান Profile Info */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <img
          src={preview}
          className="w-24 h-24 rounded-full object-cover border"
        />

        <p className="font-semibold">{session?.user?.name}</p>
        <p className="text-gray-500 text-sm">{session?.user?.email}</p>
      </div>

      {/* ✏️ Update Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <label className="text-sm font-medium">Update Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <label className="text-sm font-medium">Update Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded"
        />

        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Save Changes
        </button>
      </form>
    </div>
  );
}