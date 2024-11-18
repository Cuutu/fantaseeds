import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user || session.user.rol !== 'administrador') {
      console.log('No autorizado - rol:', session?.user?.rol);
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const orders = await Order.find()
      .populate('usuario', 'nombreApellido email')
      .populate('productos.genetic', 'nombre precio')
      .sort({ fechaPedido: -1 });

    return Response.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 