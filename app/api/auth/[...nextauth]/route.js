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

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Contraseña incorrecta');
          }

          return {
            id: user._id,
            email: user.email,
            usuario: user.usuario,
            rol: user.rol,
            nombreApellido: user.nombreApellido,
            membresia: user.membresia,
            fechaAlta: user.fechaAlta
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.usuario = user.usuario;
        token.rol = user.rol;
        token.nombreApellido = user.nombreApellido;
        token.membresia = user.membresia;
        token.fechaAlta = user.fechaAlta;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.usuario = token.usuario;
        session.user.rol = token.rol;
        session.user.nombreApellido = token.nombreApellido;
        session.user.membresia = token.membresia;
        session.user.fechaAlta = token.fechaAlta;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 