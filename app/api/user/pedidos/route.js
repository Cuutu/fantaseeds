import { headers } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ usuario: session.user.id })
      .sort({ fechaPedido: -1 })
      .populate('productos.genetic');

    return Response.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 