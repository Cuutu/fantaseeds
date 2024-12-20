import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const { paymentId, status, externalReference, payer } = await request.json();

    // Actualizar el estado del pedido con la información del comprador
    const order = await Order.findByIdAndUpdate(
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

    if (!order) {
      return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return Response.json({
      success: true,
      order
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