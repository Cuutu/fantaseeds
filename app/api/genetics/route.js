import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';
import { getServerSession } from 'next-auth/next';

export async function GET(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    
    if (!session) {
      return Response.json({ 
        success: false,
        error: 'No has iniciado sesión' 
      }, { 
        status: 401 
      });
    }

    const genetics = await Genetic.find({}).sort({ nombre: 1 });
    
    return Response.json({
      success: true,
      genetics
    });

  } catch (error) {
    console.error('Error en GET /api/genetics:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al obtener genéticas: ' + error.message
    }, { 
      status: 500 
    });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const newGenetic = await Genetic.create(data);
    
    return Response.json({
      success: true,
      genetic: newGenetic
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 