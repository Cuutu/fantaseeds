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

    // Transformamos los datos asegurándonos de que los campos del usuario existan
    const transformedOrders = orders.map(order => {
      const userInfo = order.usuario || {};
      return {
        ...order,
        usuario: {
          nombre: userInfo.nombreApellido || 'Usuario no disponible',
          email: userInfo.email || 'Email no disponible',
          usuario: userInfo.usuario || 'Usuario no disponible'
        },
        productos: order.productos.map(producto => ({
          ...producto,
          genetic: producto.genetic || { nombre: 'Producto no disponible', precio: 0 }
        })),
        metodoPago: 'mercadopago',
        total: order.total || 0,
        estado: order.estado || 'pendiente'
      };
    });

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