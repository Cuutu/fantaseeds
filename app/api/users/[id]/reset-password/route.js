import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const { id } = params;
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { 
        status: 404 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contraseña reseteada correctamente',
      newPassword: newPassword
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 