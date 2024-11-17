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
    
    console.log('Genéticas encontradas:', genetics); // Para debugging

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
    
    const session = await getServerSession();
    
    if (!session) {
      return Response.json({ 
        success: false,
        error: 'No has iniciado sesión' 
      }, { 
        status: 401 
      });
    }

    const data = await request.json();
    console.log('Datos recibidos:', data); // Para debugging

    const newGenetic = await Genetic.create(data);
    
    return Response.json({
      success: true,
      message: 'Genética creada exitosamente',
      genetic: newGenetic
    });

  } catch (error) {
    console.error('Error en POST /api/genetics:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al crear genética: ' + error.message
    }, { 
      status: 500 
    });
  }
} 