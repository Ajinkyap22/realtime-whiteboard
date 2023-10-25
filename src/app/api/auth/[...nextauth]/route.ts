import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const apiURL = process.env.API_URL ?? "";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      // get name, email & image from account
      const { name, email } = user;

      const body = {
        name,
        email,
      };

      // send data to server
      const res = await axios.post(`${apiURL}/saveuser`, body);

      if (res.status !== 500) {
        return true;
      } else {
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
