import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { 
      customerEmail, 
      customerName, 
      orderNumber, 
      orderDetails, 
      deliveryMethod, 
      shippingAddress, 
      total 
    } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Fantaseeds <no-reply@tudominio.com>',
      to: customerEmail,
      subject: `Confirmación de Pedido #${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirmación de Pedido - Fantaseeds</h2>
          <p>Hola ${customerName},</p>
          <p>¡Gracias por tu compra! Aquí están los detalles de tu pedido:</p>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Número de Pedido:</strong> #${orderNumber}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Método de entrega:</strong> ${deliveryMethod}</p>
            ${deliveryMethod === 'envio' ? `<p><strong>Dirección de entrega:</strong> ${shippingAddress}</p>` : ''}
          </div>

          <h3>Detalle del Pedido:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 8px; text-align: left;">Producto</th>
                <th style="padding: 8px; text-align: left;">Cantidad</th>
                <th style="padding: 8px; text-align: left;">Precio Unit.</th>
                <th style="padding: 8px; text-align: left;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.map(item => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.genetic.nombre}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.cantidad}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.genetic.precio}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.genetic.precio * item.cantidad}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin: 20px 0; text-align: right;">
            <p><strong>Costo de envío:</strong> ${deliveryMethod === 'envio' ? '$500' : '$0'}</p>
            <p style="font-size: 1.2em;"><strong>Total:</strong> $${total}</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Estado del pago:</strong> Pendiente</p>
            <p>Te contactaremos pronto para coordinar el pago y la entrega.</p>
          </div>

          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 0.9em;">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
          </p>
        </div>
      `
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 