import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/mongodb';
import Settings from '@/models/Settings';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.rol !== 'administrador') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    await dbConnect();

    // Verificar si ya existe la configuración del video
    const existingVideoSetting = await Settings.findOne({ key: 'youtube_video_url' });
    
    if (existingVideoSetting) {
      return NextResponse.json({ 
        success: true, 
        message: 'Configuración del video ya existe',
        setting: existingVideoSetting
      });
    }

    // Crear la configuración inicial del video
    const videoSetting = await Settings.create({
      key: 'youtube_video_url',
      value: 'https://www.youtube.com/watch?v=ESZQGGiZ_KU'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Configuración del video inicializada correctamente',
      setting: videoSetting
    });

  } catch (error) {
    console.error('Error inicializando configuración:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al inicializar configuración: ' + error.message 
    }, { status: 500 });
  }
} 