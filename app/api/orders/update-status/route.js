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

    // Buscar el pedido primero
    const order = await Order.findById(externalReference);
    
    if (!order) {
      return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Si el pago fue aprobado y el estado anterior no era 'confirmado',
    // actualizamos el stock
    if (status === 'approved' && order.estado !== 'confirmado') {
      // Actualizamos el stock de cada producto
      for (const producto of order.productos) {
        await Genetic.findByIdAndUpdate(
          producto.genetic,
          {
            $inc: { stockDisponible: -producto.cantidad }
          },
          { new: true }
        );
      }
    }

    // Actualizamos el pedido con la información del comprador y el nuevo estado
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
    console.error('Error al actualizar el estado del pedido:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 