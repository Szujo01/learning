import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/models/User";
import connectToDatabase from "@/utils/mongoose";
import { verifyPassword } from "@/utils/auth";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectToDatabase();

        let existingUser;
        try {
          existingUser = await User.findOne({ email: credentials.email });
        } catch (error) {
          throw new Error("Connection to Database failed");
        }

        if (!existingUser) {
          throw new Error("Unable to find user");
        }

        const passwordIsValid = await verifyPassword(
          credentials.password,
          existingUser.password
        );

        if (!passwordIsValid) {
          throw new Error("Invalid Credentials");
        }

        return {
          name: existingUser.name,
          email: existingUser.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
