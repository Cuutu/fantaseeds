import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';
import { getServerSession } from 'next-auth/next';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    console.log('Sesión del usuario:', session);
    
    if (!session?.user || session.user.rol !== 'administrador') {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const { id } = params;
    console.log('ID a eliminar:', id);

    console.log('Iniciando proceso de eliminación...');
    
    // En lugar de eliminar, marcamos como inactivo
    const updatedGenetic = await Genetic.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!updatedGenetic) {
      return Response.json({ 
        success: false, 
        error: 'Genética no encontrada' 
      }, { 
        status: 404 
      });
    }

    console.log('Genética eliminada:', updatedGenetic);

    return Response.json({
      success: true,
      genetic: updatedGenetic
    });

  } catch (error) {
    console.error('Error en DELETE /api/genetics/[id]:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 