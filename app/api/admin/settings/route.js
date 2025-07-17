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
    const { key, value } = await request.json();
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, setting });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al actualizar setting' }, { status: 500 });
  }
} 