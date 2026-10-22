import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedDomain = (process.env.ALLOWED_DOMAIN || "zakatsukses.org").toLowerCase();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          hd: allowedDomain,
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email?.toLowerCase() ?? "";
      return email.endsWith(`@${allowedDomain}`);
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
});
