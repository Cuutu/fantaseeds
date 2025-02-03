import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener total de usuarios
    const totalUsuarios = await User.countDocuments({ activo: true });

    // Obtener conteo de membresías
    const membresias = {
      '10G': await User.countDocuments({ membresia: '10G', activo: true }),
      '20G': await User.countDocuments({ membresia: '20G', activo: true }),
      '30G': await User.countDocuments({ membresia: '30G', activo: true }),
      '40G': await User.countDocuments({ membresia: '40G', activo: true })
    };

    // Obtener últimos 5 usuarios
    const ultimosUsuarios = await User.find({ activo: true })
      .select('nombreApellido email membresia fechaAlta')
      .sort({ createdAt: -1 })
      .limit(5);

    return new Response(JSON.stringify({
      success: true,
      totalUsuarios,
      membresias,
      ultimosUsuarios
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en dashboard:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 