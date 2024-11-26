import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';

export async function GET() {
  try {
    await dbConnect();

    // Modificamos la consulta para solo obtener genéticas activas
    const genetics = await Genetic.find({ activo: true }).sort({ nombre: 1 });

    // Log para debugging
    console.log('Genéticas públicas encontradas:', genetics.length);

    return Response.json({
      success: true,
      genetics,
      total: genetics.length
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