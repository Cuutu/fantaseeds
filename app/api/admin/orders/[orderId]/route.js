import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (session?.user?.rol !== 'administrador') {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const { orderId } = params;
    const data = await request.json();
    
    console.log('Datos de actualización:', {
      orderId,
      nuevoEstado: data.estado,
      usuarioActual: session?.user
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { estado: data.estado },
      { new: true }
    ).populate('usuario', 'nombreApellido email')
     .populate('productos.genetic', 'nombre precio');

    if (!updatedOrder) {
      return Response.json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      }, { 
        status: 404 
      });
    }

    return Response.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al actualizar el pedido: ' + error.message 
    }, { 
      status: 500 
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (session?.user?.rol !== 'administrador') {
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const { orderId } = params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return Response.json({ 
        success: false, 
        error: 'Pedido no encontrado' 
      }, { 
        status: 404 
      });
    }

    return Response.json({
      success: true,
      message: 'Pedido eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 