import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Comprobante from '@/models/Comprobante';
import Genetic from '@/models/Genetic';

export async function POST(request) {
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

    const data = await request.json();
    
    // Crear el pedido
    const order = await Order.create({
      usuario: session.user.id,
      productos: data.productos,
      total: data.total,
      estado: 'pendiente',
      metodoEntrega: data.metodoEntrega,
      direccionEnvio: data.direccionEnvio
    });

    // Crear el comprobante
    const comprobante = await Comprobante.create({
      pedido: order._id,
      usuario: session.user.id,
      archivo: Buffer.from(data.comprobante.archivo, 'base64'),
      nombreArchivo: data.comprobante.nombreArchivo,
      tipoArchivo: data.comprobante.tipoArchivo
    });

    // Actualizar stock
    for (const producto of data.productos) {
      await Genetic.findByIdAndUpdate(
        producto.genetic,
        { $inc: { stock: -producto.cantidad } }
      );
    }

    return Response.json({
      success: true,
      message: 'Pedido creado exitosamente',
      order,
      comprobanteId: comprobante._id
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

export async function GET(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    if (!session) {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const orders = await Order.find({ usuario: session.user.id })
      .populate('productos.genetic')
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      orders
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 