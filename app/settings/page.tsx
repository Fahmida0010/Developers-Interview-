"use client";

import { useState } from "react";
import { User, Bell, Lock, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const [name, setName] = useState("Fahmida Tanjina");
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const options = [
    { icon: <User size={20} />, title: "Account", desc: "Security notifications, change number" },
    { icon: <Bell size={20} />, title: "Notifications", desc: "Message, group & call tones" },
    { icon: <Lock size={20} />, title: "Privacy", desc: "Block contacts, disappearing messages" },
    { icon: <HelpCircle size={20} />, title: "Help", desc: "Help center, contact us, privacy policy" },
  ];

  return (
    <div className="p-6 bg-[#111b21] h-full">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      {/* Profile Section */}
      <div className="flex items-center gap-4 p-4 bg-[#202c33] rounded-xl mb-8">

        {/* Image */}
        <div className="relative">
          {image ? (
            <Image
              src={image}
              alt="profile"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
              {name.charAt(0)}
            </div>
          )}

          {/* Upload Button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Name + Bio */}
        <div className="flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-white text-lg font-semibold outline-none w-full"
          />
          <p className="text-gray-400 text-sm italic">
            Next.js Developer | Learning MERN
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer rounded-lg transition"
          >
            <div className="text-gray-400">{opt.icon}</div>
            <div className="flex-1 border-b border-gray-800 pb-2">
              <h3 className="text-white font-medium">{opt.title}</h3>
              <p className="text-gray-400 text-xs">{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}