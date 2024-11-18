import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Genetic from '@/models/Genetic';
import User from '@/models/User';

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

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      fechaPedido: order.fechaPedido,
      estado: order.estado,
      usuario: {
        nombreApellido: order.usuario?.nombreApellido || 'Usuario no encontrado',
        email: order.usuario?.email || 'Email no disponible'
      },
      productos: order.productos.map(prod => ({
        cantidad: prod.cantidad,
        precio: prod.precio || prod.genetic?.precio || 0,
        genetic: {
          nombre: prod.genetic?.nombre || 'Producto no disponible',
          precio: prod.genetic?.precio || 0
        }
      })),
      total: order.total || 0
    }));

    console.log('Pedidos formateados:', formattedOrders);

    return Response.json({
      success: true,
      orders: formattedOrders
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