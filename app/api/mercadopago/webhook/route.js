import { MercadoPagoConfig, Payment } from 'mercadopago';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.type === 'payment') {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: data.data.id });
      
      await dbConnect();
      
      // Actualizar el estado del pedido según el pago
      await Order.findByIdAndUpdate(
        paymentInfo.external_reference,
        {
          $set: {
            estado: paymentInfo.status === 'approved' ? 'confirmado' : paymentInfo.status,
            pagoId: paymentInfo.id,
            estadoPago: paymentInfo.status,
            fechaActualizacion: new Date()
          }
        }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
} 