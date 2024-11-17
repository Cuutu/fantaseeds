import dbConnect from '@/lib/db/mongodb';
import Genetic from '@/models/Genetic';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request, { params }) {
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

    const { id } = params;
    const data = await request.json();

    const updatedGenetic = await Genetic.findByIdAndUpdate(
      id,
      data,
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
      message: 'Genética actualizada exitosamente',
      genetic: updatedGenetic
    });

  } catch (error) {
    console.error('Error en PUT /api/genetics/[id]:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al actualizar genética: ' + error.message 
    }, { 
      status: 500 
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    
    if (!session?.user?.rol === 'administrador') {
      return Response.json({ 
        success: false,
        error: 'No tienes permisos para realizar esta acción' 
      }, { 
        status: 401 
      });
    }

    const { id } = params;
    const deletedGenetic = await Genetic.findByIdAndDelete(id);

    if (!deletedGenetic) {
      return Response.json({ 
        success: false,
        error: 'Genética no encontrada' 
      }, { 
        status: 404 
      });
    }

    return Response.json({
      success: true,
      message: 'Genética eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error en DELETE /api/genetics/[id]:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al eliminar genética: ' + error.message 
    }, { 
      status: 500 
    });
  }
} 