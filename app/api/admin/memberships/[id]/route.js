import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Membership from '@/models/Membership';

// Si en el futuro se requiere autenticación para GET, descomentar:
// export async function GET(request, { params }) {
//   const session = await getServerSession(authOptions);
//   ...
// }

// PUT - Actualizar membresía
export async function PUT(request, { params }) {
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
    const { id } = params;
    
    const membership = await Membership.findOneAndUpdate(
      { id: id },
      {
        name: data.name,
        price: data.price,
        period: data.period,
        description: data.description,
        limit: data.limit,
        features: data.features,
        active: data.active,
        order: data.order
      },
      { new: true }
    );

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Membresía no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      membership
    });
  } catch (error) {
    console.error('Error al actualizar membresía:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar membresía' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar membresía
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = params;
    
    const membership = await Membership.findOneAndDelete({ id: id });

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Membresía no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Membresía eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar membresía:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar membresía' },
      { status: 500 }
    );
  }
} 