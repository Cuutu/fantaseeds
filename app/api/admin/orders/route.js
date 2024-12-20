import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';

// Importar los modelos en orden
import User from '@/models/User';
import Genetic from '@/models/Genetic';
import Order from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.rol !== 'administrador') {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const orders = await Order.find({})
      .populate({
        path: 'usuario',
        model: User,
        select: 'nombreApellido email usuario'
      })
      .populate({
        path: 'productos.genetic',
        model: Genetic,
        select: 'nombre precio'
      })
      .sort({ fechaPedido: -1 });

    // Transformar los datos antes de enviarlos
    const transformedOrders = orders.map(order => ({
      ...order,
      usuario: order.compradorInfo ? {
        nombreApellido: `${order.compradorInfo.nombre} ${order.compradorInfo.apellido}`.trim(),
        email: order.compradorInfo.email,
        usuario: 'Cliente MercadoPago'
      } : {
        nombreApellido: order.usuario?.nombreApellido || 'Usuario no disponible',
        email: order.usuario?.email || 'Email no disponible',
        usuario: order.usuario?.usuario || 'Usuario no disponible'
      },
      // ... resto de la transformación
    }));

    console.log('Pedidos encontrados:', transformedOrders.length);

    return Response.json({
      success: true,
      orders: transformedOrders
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