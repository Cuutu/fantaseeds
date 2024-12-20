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
    
    if (!data.metodoPago) {
      return Response.json({ 
        success: false, 
        error: 'El método de pago es requerido' 
      }, { 
        status: 400 
      });
    }

    // Crear el pedido
    const order = await Order.create({
      usuario: session.user.id,
      productos: data.productos,
      total: data.total,
      estado: 'pendiente',
      metodoPago: data.metodoPago,
      metodoEntrega: data.metodoEntrega,
      direccionEnvio: data.direccionEnvio
    });

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
      order
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
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    // Modificamos la consulta para poblar la información de los productos
    const orders = await Order.find({})
      .populate('usuario', 'nombreApellido email')
      .populate('productos.genetic', 'nombre precio')
      .sort({ fechaPedido: -1 });

    return Response.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error en GET /api/orders:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al obtener pedidos: ' + error.message 
    }, { 
      status: 500 
    });
  }
} 