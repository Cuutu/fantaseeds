import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const admin = await User.findOne({ usuario: 'admin' });
    
    return Response.json({ 
      dbConnected: true,
      adminExists: !!admin,
      adminData: admin ? {
        email: admin.email,
        usuario: admin.usuario,
        rol: admin.rol
      } : null
    });

  } catch (error) {
    return Response.json({ 
      dbConnected: false,
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 