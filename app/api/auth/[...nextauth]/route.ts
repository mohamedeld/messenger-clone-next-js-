import prisma from "@/app/(root)/libs/prismadb"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth ,{AuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';

export const authOptions:AuthOptions = {
  // Configure one or more authentication providers
  adapter:PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET_KEY as string,
    }),
    CredentialsProvider({
      name:'credentials',
      credentials:{
        email:{label:'email',type:'text'},
        password:{label:'password',type:'password'}
      },
      async authorize(credentials){
        if(!credentials?.email || !credentials?.password){
          throw new Error("Invalid Credentials");
        }
      const user = await prisma.user.findUnique({
        where:{
          email:credentials?.email
        }
      });
      if(!user || !user?.hashedPassword){
        throw new Error('Invalid credentials')
      }
      const isCorrectPassword = await bcrypt.compare(credentials?.password,user?.hashedPassword);
      if(!isCorrectPassword){
        throw new Error("Invalid credentials");
      }
      return user;
      }
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages:{
    signIn:'/'
  },
  debug:process.env.NODE_ENV !== 'production',
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXTAUTH_SECRET,
  
}

const handler= NextAuth(authOptions)

export {handler as GET , handler as POST}