import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Membership from '@/models/Membership';

// GET - Obtener membresías activas (ruta pública)
export async function GET() {
  try {
    await dbConnect();
    
    // Debug: Obtener TODAS las membresías para ver qué está pasando
    const allMemberships = await Membership.find({});
    console.log('🔍 Todas las membresías en DB:', allMemberships);
    
    const memberships = await Membership.find({ active: true }).sort({ order: 1 });
    console.log('✅ Membresías activas encontradas:', memberships);
    
    return NextResponse.json({
      success: true,
      memberships
    });
  } catch (error) {
    console.error('Error al obtener membresías:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener membresías' },
      { status: 500 }
    );
  }
} 