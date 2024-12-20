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
    // Verificar la sesión
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.rol !== 'administrador') {
      return Response.json({ 
        success: false, 
        message: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    // Conectar a la base de datos
    await dbConnect();

    // Obtener los pedidos
    const orders = await Order.find({})
      .populate('usuario', 'nombreApellido email usuario')
      .populate('productos.genetic', 'nombre precio')
      .lean()
      .sort({ fechaPedido: -1 });

    // Transformar y validar los datos
    const transformedOrders = orders.map(order => ({
      _id: order._id?.toString() || '',
      fechaPedido: order.fechaPedido || new Date(),
      estado: order.estado || 'pendiente',
      metodoPago: 'mercadopago',
      metodoEntrega: order.metodoEntrega || 'retiro',
      total: order.total || 0,
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
    }));

    // Devolver respuesta exitosa
    return Response.json({
      success: true,
      orders: transformedOrders
    });

  } catch (error) {
    console.error('Error en GET /api/admin/orders:', error);
    
    // Asegurarse de que el error siempre sea un objeto JSON válido
    return Response.json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message || 'Error desconocido'
    }, { 
      status: 500 
    });
  }
} 