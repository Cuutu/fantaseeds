import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "No autorizado" });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return Response.json({ success: false, error: "Usuario no encontrado" });
    }

    return Response.json({
      success: true,
      user: {
        nombreApellido: user.nombreApellido,
        email: user.email,
        usuario: user.usuario,
        membresia: user.membresia,
        domicilio: user.domicilio,
        fechaAlta: user.fechaAlta
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: "Error al obtener datos del usuario" 
    });
  }
} 