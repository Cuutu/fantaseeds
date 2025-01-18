import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // Obtener la sesión usando authOptions
    const session = await getServerSession(authOptions);
    console.log('Sesión actual:', session);

    // Verificar autorización
    if (!session?.user) {
      console.log('No hay sesión de usuario');
      return Response.json({ 
        success: false, 
        error: 'No has iniciado sesión' 
      }, { 
        status: 401 
      });
    }

    if (session.user.rol !== 'administrador') {
      console.log('Usuario no es administrador:', session.user.rol);
      return Response.json({ 
        success: false, 
        error: 'No tienes permisos de administrador' 
      }, { 
        status: 403 
      });
    }

    const { id } = params;
    console.log('Intentando eliminar genética:', id);

    const deletedGenetic = await Genetic.findByIdAndDelete(id);
    
    if (!deletedGenetic) {
      return Response.json({ 
        success: false, 
        error: 'Genética no encontrada' 
      }, { 
        status: 404 
      });
    }

    console.log('Genética eliminada exitosamente:', deletedGenetic);

    return Response.json({
      success: true,
      message: 'Genética eliminada correctamente',
      genetic: deletedGenetic
    });

  } catch (error) {
    console.error('Error al eliminar genética:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}

// Agregar método PUT para actualización
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.rol !== 'administrador') {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const { id } = params;
    const updateData = await request.json();

    const updatedGenetic = await Genetic.findByIdAndUpdate(
      id,
      updateData,
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

    return Response.json({
      success: true,
      genetic: updatedGenetic
    });

  } catch (error) {
    console.error('Error en PUT /api/genetics/[id]:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updatedGenetic = await Genetic.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedGenetic) {
      return Response.json({ success: false, error: 'Genética no encontrada' });
    }

    return Response.json({ success: true, genetic: updatedGenetic });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
} 