import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug

    if (!session?.user?.id) {
      return Response.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Datos recibidos:', data); // Debug

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        $set: {
          nombreApellido: data.nombreApellido,
          email: data.email
        } 
      },
      { new: true }
    );

    console.log('Usuario actualizado:', updatedUser); // Debug

    if (!updatedUser) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        usuario: updatedUser.usuario,
        nombreApellido: updatedUser.nombreApellido,
        email: updatedUser.email,
        rol: updatedUser.rol,
        membresia: updatedUser.membresia
      }
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 