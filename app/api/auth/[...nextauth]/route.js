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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.usuario = user.usuario;
        token.email = user.email;
        token.nombreApellido = user.nombreApellido;
        token.rol = user.rol;
        token.membresia = user.membresia;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        const userData = await User.findOne({ email: session.user.email });
        session.user.id = token.sub;
        session.user.rol = userData.rol;
        session.user.membresia = userData.membresia;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 