import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';

export async function GET() {
  try {
    await dbConnect();

    // Primero, vamos a hacer un log de todas las genéticas
    const allGenetics = await Genetic.find({});
    console.log('Todas las genéticas:', allGenetics);

    // Luego, hacemos la consulta filtrada
    const genetics = await Genetic.find({}).sort({ nombre: 1 });

    // Log del resultado
    console.log('Genéticas filtradas:', genetics);

    return Response.json({
      success: true,
      genetics,
      total: genetics.length,
      debug: {
        totalInDB: allGenetics.length
      }
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