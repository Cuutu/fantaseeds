import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    
    if (!session) {
      return Response.json({ 
        success: false,
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const genetics = await Genetic.find({ 
      stock: { $gt: 0 },
      activo: true 
    }).sort({ nombre: 1 });

    return Response.json({
      success: true,
      genetics
    });

  } catch (error) {
    console.error('Error en GET /api/genetics/public:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al obtener genéticas: ' + error.message
    }, { 
      status: 500 
    });
  }
} 