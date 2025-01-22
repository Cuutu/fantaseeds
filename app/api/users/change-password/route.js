import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
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
      }, { 
        status: 400 
      });
    }

    // Hashear y guardar la nueva contraseña proporcionada por el usuario
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
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