import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Settings from '@/models/Settings';

// GET - Obtener todos los settings
export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.find({});
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error en GET settings:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener settings' }, { status: 500 });
  }
}

// PUT - Actualizar un setting por key
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { key, value } = body;
    
    if (!key || !value) {
      return NextResponse.json({ success: false, error: 'Key y value son requeridos' }, { status: 400 });
    }
    
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error('Error en PUT settings:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar setting' }, { status: 500 });
  }
}

// POST - Alternativa para crear/actualizar (por si PUT no funciona)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { key, value } = body;
    
    if (!key || !value) {
      return NextResponse.json({ success: false, error: 'Key y value son requeridos' }, { status: 400 });
    }
    
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error('Error en POST settings:', error);
    return NextResponse.json({ success: false, error: 'Error al crear/actualizar setting' }, { status: 500 });
  }
} 