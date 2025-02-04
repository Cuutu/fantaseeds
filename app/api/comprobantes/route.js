import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Comprobante from '@/models/Comprobante';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('comprobante');
    const orderId = formData.get('orderId');

    if (!file || !orderId) {
      return Response.json({ 
        success: false, 
        error: 'Faltan datos requeridos' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await dbConnect();

    const comprobante = await Comprobante.create({
      pedido: orderId,
      usuario: session.user.id,
      archivo: buffer,
      nombreArchivo: file.name,
      tipoArchivo: file.type,
      tamano: buffer.length
    });

    return Response.json({
      success: true,
      comprobante: {
        id: comprobante._id,
        nombreArchivo: comprobante.nombreArchivo
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 