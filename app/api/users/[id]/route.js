import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const user = await User.findByIdAndUpdate(
      params.id,
      {
        $set: {
          nombreApellido: data.nombreApellido,
          email: data.email,
          domicilio: data.domicilio,
          membresia: data.membresia,
          rol: data.rol
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { 
        status: 404 
      });
    }

    return Response.json({
      success: true,
      user: {
        ...user.toObject(),
        id: user._id
      }
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

export async function DELETE(request, { params }) {
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

    const userId = params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { 
        status: 404 
      });
    }

    return Response.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en DELETE /api/users/[id]:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al eliminar usuario: ' + error.message
    }, { 
      status: 500 
    });
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const user = await User.findById(params.id).select('-password');
    
    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { 
        status: 404 
      });
    }

    return Response.json({
      success: true,
      user: {
        ...user.toObject(),
        id: user._id
      }
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