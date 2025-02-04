import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { uploadImage } from "@/lib/uploadImage"; // Necesitarás crear esta función

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const comprobante = formData.get('comprobante');
    const cart = JSON.parse(formData.get('cart'));
    const deliveryMethod = formData.get('deliveryMethod');
    const shippingAddress = deliveryMethod === 'envio' ? JSON.parse(formData.get('shippingAddress')) : null;

    // Subir comprobante a tu servicio de almacenamiento
    const comprobanteUrl = await uploadImage(comprobante);

    await dbConnect();

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

    return Response.json({ success: true, orderId: order._id });

  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return Response.json({ 
      success: false, 
      error: "Error al procesar la transferencia" 
    }, { status: 500 });
  }
} 