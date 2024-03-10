import { db } from "@/app/_lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    adapter: PrismaAdapter(db) as Adapter,
    providers: [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })],
    callbacks: {
        async session({session, user}) {
            session.user = {...session.user, id: user.id} as {
                id: string;
                name: string;
                email: string;
            };
            return session;
        }
    }

})

export { handler as GET, handler as POST }
