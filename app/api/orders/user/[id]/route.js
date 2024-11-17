import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const orders = await Order.find({ 
      usuario: params.id 
    })
    .populate('productos.genetic', 'nombre precio') // Solo traemos nombre y precio
    .sort({ fechaPedido: -1 });

    // Transformar los datos antes de enviarlos
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      fechaPedido: order.fechaPedido,
      estado: order.estado,
      productos: order.productos.map(prod => ({
        cantidad: prod.cantidad,
        precio: prod.precio || prod.genetic?.precio || 0,
        genetic: {
          nombre: prod.genetic?.nombre || 'Producto',
          precio: prod.genetic?.precio || 0
        }
      })),
      total: order.total || 0
    }));

    return Response.json({
      success: true,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 