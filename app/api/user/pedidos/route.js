import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const pedidos = await Order.find({ 
      usuario: session.user.id 
    })
    .populate('productos.genetic')
    .sort({ fechaPedido: -1 });

    console.log('Session user:', session.user);
    console.log('Pedidos encontrados:', pedidos);

    return Response.json({
      success: true,
      pedidos
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