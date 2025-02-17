import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';

export async function POST(request) {
  try {
    await dbConnect(); // Aseguramos la conexión a la base de datos

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'La contraseña actual es incorrecta' 
      });
    }

    // Actualizar la contraseña - el middleware pre-save se encargará del hash
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Contraseña actualizada correctamente' 
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al cambiar la contraseña' 
    });
  }
} 