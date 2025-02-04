import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Comprobante from '@/models/Comprobante';
import Genetic from '@/models/Genetic';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    await dbConnect();

    // Verificar stock disponible
    for (const item of data.productos) {
      const genetic = await Genetic.findById(item.genetic._id);
      if (!genetic) {
        return Response.json({ 
          success: false, 
          error: `Producto no encontrado: ${item.genetic.nombre}` 
        }, { status: 404 });
      }
      
      if (genetic.stock < item.cantidad) {
        return Response.json({ 
          success: false, 
          error: `Stock insuficiente para ${genetic.nombre}. Disponible: ${genetic.stock}` 
        }, { status: 400 });
      }
    }

    // Crear el pedido
    const order = await Order.create({
      usuario: session.user.id,
      productos: data.productos,
      total: data.total,
      estado: 'pendiente',
      metodoPago: data.metodoPago,
      metodoEntrega: data.metodoEntrega,
      direccionEnvio: data.direccionEnvio,
      informacionCliente: data.informacionCliente
    });

    // Actualizar stock
    for (const item of data.productos) {
      await Genetic.findByIdAndUpdate(
        item.genetic._id,
        { $inc: { stock: -item.cantidad } }
      );
    }

    // Si es transferencia, crear el comprobante
    if (data.metodoPago === 'transferencia' && data.comprobante) {
      await Comprobante.create({
        pedido: order._id,
        usuario: session.user.id,
        archivo: Buffer.from(data.comprobante.archivo, 'base64'),
        nombreArchivo: data.comprobante.nombreArchivo,
        tipoArchivo: data.comprobante.tipoArchivo,
        tamano: Buffer.from(data.comprobante.archivo, 'base64').length
      });
    }

    return Response.json({
      success: true,
      message: 'Pedido creado exitosamente',
      order
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();

    // Si es admin, obtener todos los pedidos
    // Si es usuario normal, obtener solo sus pedidos
    const query = session.user.role === 'admin' 
      ? {} 
      : { usuario: session.user.id };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('usuario', 'email name')
      .populate('productos.genetic', 'nombre precio');

    return Response.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al obtener los pedidos' 
    }, { 
      status: 500 
    });
  }
} 