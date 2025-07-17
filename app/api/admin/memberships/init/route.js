import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db/mongodb';
import Membership from '@/models/Membership';

// POST - Inicializar membresías por defecto
export async function POST() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Verificar si ya existen membresías
    const existingMemberships = await Membership.countDocuments();
    
    if (existingMemberships > 0) {
      return NextResponse.json({
        success: false,
        error: 'Ya existen membresías en la base de datos'
      });
    }

    const defaultMemberships = [
      {
        id: '10G',
        name: '10G',
        price: '$15.000',
        period: '/mes',
        description: 'Ideal para empezar',
        limit: '10 unidades por mes',
        features: [
          'Hasta 10 unidades mensuales',
          'Acceso a todas las genéticas',
          'Soporte básico',
          'Envíos a todo el país'
        ],
        active: true,
        order: 1
      },
      {
        id: '20G',
        name: '20G',
        price: '$28.000',
        period: '/mes',
        description: 'Para uso regular',
        limit: '20 unidades por mes',
        features: [
          'Hasta 20 unidades mensuales',
          'Acceso a todas las genéticas',
          'Soporte prioritario',
          'Envíos gratis',
          'Descuentos especiales'
        ],
        active: true,
        order: 2
      },
      {
        id: '30G',
        name: '30G',
        price: '$40.000',
        period: '/mes',
        description: 'Para usuarios frecuentes',
        limit: '30 unidades por mes',
        features: [
          'Hasta 30 unidades mensuales',
          'Acceso a todas las genéticas',
          'Soporte VIP',
          'Envíos gratis express',
          'Descuentos premium',
          'Acceso anticipado a nuevas genéticas'
        ],
        active: true,
        order: 3
      },
      {
        id: '40G',
        name: '40G',
        price: '$50.000',
        period: '/mes',
        description: 'Membresía premium',
        limit: '40 unidades por mes',
        features: [
          'Hasta 40 unidades mensuales',
          'Acceso a todas las genéticas',
          'Soporte VIP 24/7',
          'Envíos gratis express',
          'Descuentos máximos',
          'Acceso anticipado',
          'Asesoramiento personalizado',
          'Genéticas exclusivas'
        ],
        active: true,
        order: 4
      }
    ];

    await Membership.insertMany(defaultMemberships);

    return NextResponse.json({
      success: true,
      message: 'Membresías inicializadas correctamente',
      count: defaultMemberships.length
    });
  } catch (error) {
    console.error('Error al inicializar membresías:', error);
    return NextResponse.json(
      { success: false, error: 'Error al inicializar membresías' },
      { status: 500 }
    );
  }
} 