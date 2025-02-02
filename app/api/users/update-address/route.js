import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const { calle, numero, codigoPostal, localidad } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          'domicilio.calle': calle,
          'domicilio.numero': numero,
          'domicilio.codigoPostal': codigoPostal,
          'domicilio.localidad': localidad
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el domicilio:', error);
    return Response.json({ success: false, error: "Error al actualizar el domicilio" }, { status: 500 });
  }
} 