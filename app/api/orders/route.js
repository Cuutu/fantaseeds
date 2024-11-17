import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
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
    console.log('Datos recibidos:', data); // Para debug
    
    // Crear el pedido asegurándonos de que todos los campos requeridos estén presentes
    const order = await Order.create({
      usuario: session.user.id,
      productos: data.productos.map(p => ({
        genetic: p.genetic, // Este debe ser el ObjectId del producto
        cantidad: p.cantidad,
        precio: p.precio
      })),
      total: data.total,
      estado: 'pendiente',
      fechaPedido: new Date()
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
      order
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