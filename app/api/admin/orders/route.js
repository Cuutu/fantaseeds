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
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No autorizado' 
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
      .lean()
      .sort({ fechaPedido: -1 });

    return new Response(
      JSON.stringify({
        success: true,
        orders: orders.map(order => ({
          ...order,
          usuario: {
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
        }))
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
        error: 'Error interno del servidor' 
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