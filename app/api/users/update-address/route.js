import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();
    const { calle, numero, codigoPostal, localidad } = await req.json();
    console.log('Datos recibidos:', { calle, numero, codigoPostal, localidad }); // Debug

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          calle,
          numero,
          codigoPostal,
          localidad
        }
      },
      { new: true }
    );

    console.log('Usuario actualizado:', updatedUser); // Debug

    if (!updatedUser) {
      return Response.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      user: {
        ...updatedUser.toObject(),
        id: updatedUser._id
      }
    });
  } catch (error) {
    console.error('Error al actualizar el domicilio:', error);
    return Response.json({ success: false, error: "Error al actualizar el domicilio" }, { status: 500 });
  }
} 