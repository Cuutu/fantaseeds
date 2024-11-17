import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const admin = await User.findOne({ usuario: 'admin' });
    
    if (!admin) {
      return Response.json({ 
        message: 'Usuario admin no encontrado' 
      });
    }

    return Response.json({ 
      message: 'Usuario encontrado',
      user: {
        usuario: admin.usuario,
        email: admin.email,
        rol: admin.rol
      }
    });
  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 