import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Genetic from '@/models/Genetic';
import User from '@/models/User';

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

    // Validar stock antes de crear el pedido
    for (const item of cart) {
      const genetic = await Genetic.findById(item.genetic._id).lean();
      
      if (!genetic) {
        return Response.json({
          success: false,
          error: `Producto no encontrado: ${item.genetic.nombre}`
        }, { status: 400 });
      }

      // Usar el campo stock en lugar de stockDisponible
      const stockActual = genetic.stock;
      const cantidadSolicitada = item.cantidad;

      console.log('Debug stock:', {
        producto: genetic.nombre,
        stockDB: genetic.stock,
        cantidadSolicitada
      });

      if (stockActual < cantidadSolicitada) {
        return Response.json({
          success: false,
          error: `Stock insuficiente para ${genetic.nombre}. Disponible: ${stockActual}`
        }, { status: 400 });
      }
    }

    // Obtener la información completa del usuario antes de crear el pedido
    const usuario = await User.findById(session.user.id).select('email nombreApellido').lean();
    if (!usuario) {
      return Response.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { 
        status: 404 
      });
    }

    // Crear el pedido
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
      direccionEnvio: deliveryMethod === 'envio' ? shippingAddress : null,
      informacionCliente: {
        nombre: usuario.nombreApellido || 'Usuario',
        email: usuario.email,
        telefono: ''
      }
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
          cost: 1,
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