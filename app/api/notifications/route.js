import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import * as emailjs from '@emailjs/nodejs';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { orderId, userId, total } = data;

    // Obtener información del usuario
    const user = await User.findById(userId);

    // Inicializar EmailJS con las credenciales
    emailjs.init({
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY
    });

    const templateParams = {
      from_name: 'Fantaseeds',
      to_name: 'Admin',
      order_number: orderId.slice(-6),
      customer_name: user.nombreApellido,
      customer_email: user.email,
      customer_address: `${user.domicilio?.calle || 'No especificada'} ${user.domicilio?.numero || ''}`,
      order_total: total,
      message: `
        Nuevo Pedido Recibido
        Número: #${orderId.slice(-6)}
        Cliente: ${user.nombreApellido}
        Email: ${user.email}
        Dirección: ${user.domicilio?.calle || 'No especificada'} ${user.domicilio?.numero || ''}
        Total: $${total}
      `
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID,
      templateParams
    );

    return Response.json({
      success: true,
      message: 'Notificación enviada exitosamente'
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 