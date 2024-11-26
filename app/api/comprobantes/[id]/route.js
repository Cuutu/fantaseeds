import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Comprobante from '@/models/Comprobante';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const comprobante = await Comprobante.findById(params.id);
    
    if (!comprobante) {
      return Response.json({ 
        success: false, 
        error: 'Comprobante no encontrado' 
      }, { 
        status: 404 
      });
    }

    // Convertir el Buffer a base64 para enviar al cliente
    const base64 = comprobante.archivo.toString('base64');

    return Response.json({
      success: true,
      comprobante: {
        ...comprobante._doc,
        archivo: base64
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 