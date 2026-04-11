"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Amra manually handle korbo jeno error dekhano jay
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#202c33] p-10 rounded-2xl shadow-2xl border border-gray-800">
        <div className="bg-[#00a884] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="text-white" size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-[#e9edef] text-center mb-2">Welcome Back</h1>
        <p className="text-[#8696a0] text-center mb-8">Sign in to your account</p>

        {error && (
          <p className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-500/20 text-center">
            {error}
          </p>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-[#2a3942] text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-[#00a884] transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#2a3942] text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-[#00a884] transition"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a884] hover:bg-[#06cf9c] text-[#111b21] font-bold py-3 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Log In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm italic">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={() => signIn("google", { callbackUrl: "/chat" })}
          className="w-full flex items-center justify-center gap-4 bg-white text-[#111b21] font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all shadow-md"
        >
          <img src="https://authjs.dev/img/providers/google.svg" width="20" alt="Google" />
          Continue with Google
        </button>

        {/* Register Route Link */}
        <p className="mt-8 text-[#8696a0] text-sm text-center">
          New to DevChat? {' '}
          <Link href="/register" className="text-[#00a884] hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}