import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { uploadImage } from "@/lib/uploadImage";

export async function POST(req) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Error: No hay sesión activa');
      return Response.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    // Obtener y validar datos del formulario
    const formData = await req.formData();
    const comprobante = formData.get('comprobante');
    if (!comprobante) {
      console.log('Error: No se recibió comprobante');
      return Response.json({ success: false, error: "Comprobante requerido" }, { status: 400 });
    }

    // Parsear datos del carrito
    let cart;
    try {
      cart = JSON.parse(formData.get('cart'));
      if (!Array.isArray(cart) || cart.length === 0) {
        throw new Error('Carrito inválido');
      }
    } catch (error) {
      console.log('Error al parsear el carrito:', error);
      return Response.json({ success: false, error: "Carrito inválido" }, { status: 400 });
    }

    const deliveryMethod = formData.get('deliveryMethod');
    let shippingAddress = null;
    
    if (deliveryMethod === 'envio') {
      try {
        shippingAddress = JSON.parse(formData.get('shippingAddress'));
      } catch (error) {
        console.log('Error al parsear la dirección:', error);
        return Response.json({ success: false, error: "Dirección inválida" }, { status: 400 });
      }
    }

    // Subir comprobante
    let comprobanteUrl;
    try {
      comprobanteUrl = await uploadImage(comprobante);
    } catch (error) {
      console.log('Error al subir el comprobante:', error);
      return Response.json({ success: false, error: "Error al subir el comprobante" }, { status: 500 });
    }

    // Conectar a la base de datos
    await dbConnect();

    // Crear el pedido
    const order = await Order.create({
      usuario: session.user.id,
      productos: cart.map(item => ({
        genetic: item.genetic._id,
        cantidad: item.cantidad,
        precio: item.genetic.precio
      })),
      total: cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0),
      estado: 'pendiente',
      metodoPago: 'transferencia',
      metodoEntrega: deliveryMethod,
      direccionEnvio: shippingAddress,
      comprobante: comprobanteUrl
    });

    console.log('Pedido creado exitosamente:', order._id);
    return Response.json({ success: true, orderId: order._id });

  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return Response.json({ 
      success: false, 
      error: "Error al procesar la transferencia: " + error.message 
    }, { status: 500 });
  }
} 