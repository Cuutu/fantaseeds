import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { cart, deliveryMethod, shippingAddress } = data;

    await dbConnect();

    // Crear el pedido primero
    const order = await Order.create({
      usuario: session.user.id,
      productos: cart.map(item => ({
        genetic: item.genetic._id,
        cantidad: item.cantidad,
        precio: item.genetic.precio
      })),
      total: cart.reduce((acc, item) => 
        acc + (item.genetic.precio * item.cantidad), 0) + 
        (deliveryMethod === 'envio' ? 500 : 0),
      estado: 'pendiente',
      metodoPago: 'mercadopago',
      metodoEntrega: deliveryMethod,
      direccionEnvio: deliveryMethod === 'envio' ? shippingAddress : null
    });

    const preference = new Preference(client);

    // Crear preferencia de pago
    const preferenceData = {
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
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/pending`,
      },
      auto_return: "approved",
      external_reference: order._id.toString(), // Usar el ID del pedido creado
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
    };

    const response = await preference.create({ body: preferenceData });

    return Response.json({
      success: true,
      preferenceId: response.id,
      orderId: order._id
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