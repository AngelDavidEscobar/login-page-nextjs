import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import { MongoClient } from 'mongodb';
import { User } from '../../../types/user';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credenciales no proporcionadas.');
        }

        const client: MongoClient = await connectToDatabase();
        const usersCollection = client.db("aportes_linea").collection('users');
        
        const user = await usersCollection.findOne<User>({ email: credentials.email });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Contraseña incorrecta');
        }

        return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  }, callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; 
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
