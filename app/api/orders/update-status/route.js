import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Genetic from '@/models/Genetic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const { paymentId, status, externalReference, payer } = await request.json();

    // Buscar el pedido
    const order = await Order.findById(externalReference);
    
    if (!order) {
      return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Actualizar stock solo si el pago fue aprobado y el pedido no estaba ya confirmado
    if (status === 'approved' && order.estado !== 'confirmado') {
      // Actualizar el stock de cada producto
      for (const producto of order.productos) {
        const genetic = await Genetic.findById(producto.genetic);
        
        if (genetic) {
          // Verificar que hay stock suficiente
          if (genetic.stockDisponible < producto.cantidad) {
            return Response.json({
              error: `Stock insuficiente para ${genetic.nombre}`
            }, { status: 400 });
          }

          // Actualizar el stock
          await Genetic.findByIdAndUpdate(
            producto.genetic,
            { 
              $inc: { 
                stockDisponible: -producto.cantidad,
                stock: -producto.cantidad 
              } 
            },
            { new: true }
          );
        }
      }
    }

    // Actualizar el estado del pedido
    const updatedOrder = await Order.findByIdAndUpdate(
      externalReference,
      {
        $set: {
          estado: status === 'approved' ? 'confirmado' : status,
          pagoId: paymentId,
          compradorInfo: {
            nombre: payer?.first_name || '',
            apellido: payer?.last_name || '',
            email: payer?.email || ''
          }
        }
      },
      { new: true }
    );

    return Response.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 