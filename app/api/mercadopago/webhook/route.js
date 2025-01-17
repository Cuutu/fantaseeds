import { MercadoPagoConfig, Payment } from 'mercadopago';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Genetic from '@/models/Genetic';

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
      
      const order = await Order.findById(paymentInfo.external_reference);
      
      if (!order) {
        throw new Error('Pedido no encontrado');
      }

      // Solo actualizar stock si el pago fue aprobado y el pedido no estaba ya confirmado
      if (paymentInfo.status === 'approved' && order.estado !== 'confirmado') {
        for (const producto of order.productos) {
          const genetic = await Genetic.findById(producto.genetic);
          
          if (genetic) {
            // Verificar stock usando el campo stock
            if (genetic.stock < producto.cantidad) {
              throw new Error(`Stock insuficiente para ${genetic.nombre}`);
            }

            // Actualizar solo el campo stock
            await Genetic.findByIdAndUpdate(
              producto.genetic,
              { 
                $inc: { 
                  stock: -producto.cantidad 
                } 
              },
              { new: true }
            );
          }
        }
      }
      
      // Actualizar el estado del pedido
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