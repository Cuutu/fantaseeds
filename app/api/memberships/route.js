import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Membership from '@/models/Membership';

// GET - Obtener membresías activas (ruta pública)
export async function GET() {
  try {
    await dbConnect();
    const memberships = await Membership.find({ active: true }).sort({ order: 1 });
    
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