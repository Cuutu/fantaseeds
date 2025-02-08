import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Enviar email con la nueva contraseña
    await resend.emails.send({
      from: 'FANTASEEDS <contacto@fantaseeds.com.ar>',
      to: updatedUser.email,
      subject: 'Tu contraseña ha sido reseteada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Reseteo de Contraseña</h2>
          
          <p style="color: #666; line-height: 3.6;">
            Hola ${updatedUser.nombreApellido},
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Tu contraseña ha sido reseteada por un administrador. 
            A continuación encontrarás tu nueva contraseña:
          </p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <code style="font-size: 20px; color: #333;">${newPassword}</code>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Por seguridad, te recomendamos cambiar esta contraseña una vez que ingreses a tu cuenta.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Si no solicitaste este cambio, por favor contacta con soporte inmediatamente.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Este es un email automático, por favor no respondas a este mensaje.
          </p>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contraseña reseteada y email enviado correctamente',
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