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
    
    if (session?.user?.rol !== 'administrador') {
      return Response.json({ 
        success: false,
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const data = await request.json();
    console.log('Datos recibidos en API:', data);

    if (!data.imagen) {
      return Response.json({
        success: false,
        error: 'La imagen es requerida'
      }, {
        status: 400
      });
    }

    const newGenetic = await Genetic.create({
      nombre: data.nombre,
      precio: data.precio,
      thc: data.thc,
      stock: data.stock,
      descripcion: data.descripcion,
      imagen: data.imagen,
      activo: true
    });
    
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