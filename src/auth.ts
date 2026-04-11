import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs"; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // 🔐 Credentials Login
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 🔎 Supabase থেকে user খুঁজবো
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) return null;

        // 🔐 bcrypt দিয়ে password compare
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password // DB এ hashed password থাকবে
        );

        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),

    // 🌐 Google Login
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
  if (account?.provider === "google") {
    const { error } = await supabase.from("users").upsert(
      [
        {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      ],
      { onConflict: "email" }
    );

    if (error) {
      console.log(" Supabase error:", error.message);
    
    }
  }

  return true; 
},
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || token.id;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});