"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // রেজিস্ট্রেশন সফল হলে সরাসরি লগইন করিয়ে দেওয়া ভালো
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: true,
          callbackUrl: "/chat",
        });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#202c33] p-10 rounded-2xl shadow-2xl border border-gray-800">
        <div className="bg-[#00a884]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00a884]/30">
          <UserPlus className="text-[#00a884]" size={30} />
        </div>

        <h1 className="text-2xl font-bold text-[#e9edef] text-center mb-6">Create Account</h1>

        {error && <p className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-500/20">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#2a3942] text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-[#00a884] transition"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-[#2a3942] text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-[#00a884] transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#2a3942] text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-[#00a884] transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-3 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm italic">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/chat" })}
          className="w-full flex items-center justify-center gap-4 bg-white text-[#111b21] font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
        >
          <img src="https://authjs.dev/img/providers/google.svg" width="20" alt="Google" />
          Google
        </button>

        <p className="mt-8 text-[#8696a0] text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00a884] hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}