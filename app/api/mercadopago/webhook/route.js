import mercadopago from 'mercadopago';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.type === 'payment') {
      const payment = await mercadopago.payment.findById(data.data.id);
      const orderId = payment.external_reference;
      
      await dbConnect();
      
      // Actualizar el estado del pedido según el pago
      await Order.findByIdAndUpdate(orderId, {
        estado: payment.status === 'approved' ? 'confirmado' : 'pendiente',
        pagoId: payment.id,
        estadoPago: payment.status
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 