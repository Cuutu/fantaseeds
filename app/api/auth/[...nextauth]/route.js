import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { usuario: credentials.email }
            ]
          });

          if (!user) {
            throw new Error('Usuario no encontrado');
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error('Contraseña incorrecta');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            usuario: user.usuario,
            rol: user.rol,
            nombreApellido: user.nombreApellido,
            membresia: user.membresia
          };
        } catch (error) {
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.usuario = user.usuario;
        token.rol = user.rol;
        token.nombreApellido = user.nombreApellido;
        token.membresia = user.membresia;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          usuario: token.usuario,
          rol: token.rol,
          nombreApellido: token.nombreApellido,
          membresia: token.membresia
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 