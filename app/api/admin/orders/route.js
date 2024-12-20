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
      ...order.toObject(),
      usuario: {
        nombreApellido: order.usuario?.nombreApellido || 'Usuario no disponible',
        email: order.usuario?.email || 'Email no disponible',
        usuario: order.usuario?.usuario || 'Usuario no disponible'
      }
    }));

    console.log('Pedidos encontrados:', transformedOrders.length);

    return new Response(
      JSON.stringify({
        success: true,
        orders: transformedOrders.map(order => {
          const userInfo = order.usuario || {};
          return {
            ...order,
            usuario: {
              nombreApellido: userInfo.nombreApellido || 'Usuario no disponible',
              email: userInfo.email || 'Email no disponible',
              usuario: userInfo.usuario || 'Usuario no disponible'
            },
            productos: (order.productos || []).map(producto => ({
              genetic: {
                nombre: producto.genetic?.nombre || 'Producto no disponible',
                precio: producto.genetic?.precio || 0
              },
              cantidad: producto.cantidad || 0,
              precio: producto.precio || 0
            }))
          };
        })
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

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