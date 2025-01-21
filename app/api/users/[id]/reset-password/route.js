import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Generar contraseña aleatoria de 8 caracteres
    const newPassword = Math.random().toString(36).slice(-8);
    
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contraseña reseteada correctamente',
      newPassword: newPassword // Solo para propósitos de demostración
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
} 