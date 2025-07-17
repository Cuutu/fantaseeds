import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Membership from '@/models/Membership';

// GET - Obtener todas las membresías
export async function GET() {
  try {
    await dbConnect();
    const memberships = await Membership.find({}).sort({ order: 1 });
    
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

// POST - Crear nueva membresía
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 403 }
      );
    }

    await dbConnect();
    const data = await request.json();
    
    const membership = await Membership.create({
      id: data.id,
      name: data.name,
      price: data.price,
      period: data.period || '/mes',
      description: data.description,
      limit: data.limit,
      features: data.features,
      active: data.active ?? true,
      order: data.order || 0
    });

    return NextResponse.json({
      success: true,
      membership
    });
  } catch (error) {
    console.error('Error al crear membresía:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear membresía' },
      { status: 500 }
    );
  }
} 