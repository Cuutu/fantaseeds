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
    
    console.log('Session ID:', session.user.id);
    console.log('Datos a actualizar:', { calle, numero, codigoPostal, localidad });

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          'domicilio.calle': calle,
          'domicilio.numero': numero,
          'domicilio.codigoPostal': codigoPostal,
          'domicilio.ciudad': localidad, // Nota: en la BD es 'ciudad' no 'localidad'
          'domicilio.provincia': '' // Mantenemos este campo aunque esté vacío
        }
      },
      { new: true }
    );

    console.log('Usuario actualizado:', updatedUser);

    if (!updatedUser) {
      return Response.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      user: {
        id: updatedUser._id,
        domicilio: updatedUser.domicilio
      }
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ 
      success: false, 
      error: "Error al actualizar el domicilio: " + error.message 
    }, { status: 500 });
  }
} 