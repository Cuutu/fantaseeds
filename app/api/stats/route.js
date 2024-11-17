import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
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

    // Obtener total de usuarios
    const totalUsers = await User.countDocuments();

    // Obtener distribución de membresías
    const membershipDistribution = {
      '10G': await User.countDocuments({ membresia: '10G' }),
      '20G': await User.countDocuments({ membresia: '20G' }),
      '30G': await User.countDocuments({ membresia: '30G' })
    };

    // Obtener usuarios recientes
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ _id: -1 })
      .limit(5)
      .lean();

    return Response.json({
      success: true,
      stats: {
        totalUsers,
        membershipDistribution,
        recentUsers
      }
    });

  } catch (error) {
    console.error('Error en GET /api/stats:', error);
    return Response.json({ 
      success: false, 
      error: 'Error al obtener estadísticas: ' + error.message
    }, { 
      status: 500 
    });
  }
} 