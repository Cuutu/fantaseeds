import mercadopago from 'mercadopago';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { cart, deliveryMethod } = data;

    // Calcular el total incluyendo envío si corresponde
    const total = cart.reduce((acc, item) => 
      acc + (item.genetic.precio * item.cantidad), 0) + 
      (deliveryMethod === 'envio' ? 500 : 0);

    // Crear preferencia de pago
    const preference = {
      items: cart.map(item => ({
        title: item.genetic.nombre,
        unit_price: item.genetic.precio,
        quantity: item.cantidad,
      })),
      // Agregar costo de envío si corresponde
      ...(deliveryMethod === 'envio' && {
        shipments: {
          cost: 500,
          mode: "not_specified",
        }
      }),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },
      auto_return: "approved",
      external_reference: session.user.id,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`,
    };

    const response = await mercadopago.preferences.create(preference);

    return Response.json({
      success: true,
      init_point: response.body.init_point
    });

  } catch (error) {
    console.error('Error en MercadoPago:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 