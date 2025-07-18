import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Membership from '@/models/Membership';

// POST - Reparar membresías existentes
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Obtener todas las membresías
    const allMemberships = await Membership.find({});
    console.log('🔍 Membresías antes de reparar:', allMemberships);
    
    // Actualizar todas las membresías para asegurar que tengan active: true
    const result = await Membership.updateMany(
      {}, 
      { $set: { active: true } }
    );
    
    console.log('🔧 Resultado de reparación:', result);
    
    // Obtener las membresías actualizadas
    const updatedMemberships = await Membership.find({});
    console.log('✅ Membresías después de reparar:', updatedMemberships);

    return NextResponse.json({
      success: true,
      message: 'Membresías reparadas exitosamente',
      modifiedCount: result.modifiedCount,
      memberships: updatedMemberships
    });
  } catch (error) {
    console.error('Error al reparar membresías:', error);
    return NextResponse.json(
      { success: false, error: 'Error al reparar membresías' },
      { status: 500 }
    );
  }
} 