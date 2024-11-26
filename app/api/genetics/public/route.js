import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    console.log('Consultando genéticas públicas...');

    const genetics = await Genetic.find({
      activo: true
    }).sort({ nombre: 1 });

    console.log(`Encontradas ${genetics.length} genéticas activas`);

    return Response.json({
      success: true,
      genetics,
      total: genetics.length,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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