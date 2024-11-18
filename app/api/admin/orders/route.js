import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Genetic from '@/models/Genetic';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session antes de DB:', session);

    await dbConnect();
    console.log('DB conectada');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Colecciones disponibles:', collections.map(c => c.name));
    
    if (!session?.user || session.user.rol !== 'administrador') {
      console.log('No autorizado - rol:', session?.user?.rol);
      return Response.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { 
        status: 401 
      });
    }

    const orderCount = await Order.countDocuments();
    console.log('Cantidad de pedidos:', orderCount);

    const orders = await Order.find({})
      .populate({
        path: 'usuario',
        select: 'nombreApellido email',
        model: 'users'
      })
      .populate({
        path: 'productos.genetic',
        select: 'nombre precio',
        model: 'genetics'
      })
      .sort({ fechaPedido: -1 });

    console.log('Pedidos encontrados:', orders.length);

    return Response.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 