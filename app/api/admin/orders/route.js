import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Genetic from '@/models/Genetic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.rol !== 'administrador') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No autorizado' 
        }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await dbConnect();

    const orders = await Order.find({})
      .populate('usuario', 'nombreApellido email usuario')
      .populate('productos.genetic', 'nombre precio')
      .lean()
      .sort({ fechaPedido: -1 });

    const transformedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      usuario: order.compradorInfo ? {
        nombreApellido: `${order.compradorInfo.nombre} ${order.compradorInfo.apellido}`.trim(),
        email: order.compradorInfo.email,
        usuario: 'Cliente MercadoPago'
      } : {
        nombreApellido: order.usuario?.nombreApellido || 'Usuario no disponible',
        email: order.usuario?.email || 'Email no disponible',
        usuario: order.usuario?.usuario || 'Usuario no disponible'
      },
      productos: (order.productos || []).map(producto => ({
        genetic: {
          nombre: producto.genetic?.nombre || 'Producto no disponible',
          precio: producto.genetic?.precio || 0
        },
        cantidad: producto.cantidad || 0,
        precio: producto.precio || 0
      }))
    }));

    return new Response(
      JSON.stringify({
        success: true,
        orders: transformedOrders
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error en GET /api/admin/orders:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
        error: error.message || 'Error desconocido'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 