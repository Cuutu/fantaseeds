import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';

export async function GET(request) {
  try {
    await dbConnect();
    const users = await User.find({}).select('-password').lean();
    return Response.json({
      success: true,
      users: users
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    console.log('Datos recibidos:', data);

    // Validar campos requeridos
    if (!data.usuario || !data.password || !data.email) {
      return Response.json({ 
        success: false, 
        error: 'Faltan campos requeridos' 
      }, { 
        status: 400 
      });
    }

    // Crear el documento del usuario
    const userData = {
      usuario: data.usuario,
      password: data.password,
      nombreApellido: data.nombreApellido || '',
      email: data.email.toLowerCase(),
      membresia: data.membresia || '10G',
      rol: 'usuario',
      activo: true,
      domicilio: {
        calle: '',
        numero: '',
        codigoPostal: '',
        ciudad: '',
        provincia: ''
      }
    };

    console.log('Creando usuario con datos:', userData);

    // Crear el usuario usando create
    const newUser = await User.create(userData);
    
    // Verificar que se haya guardado correctamente
    const savedUser = await User.findById(newUser._id);
    console.log('Usuario guardado en DB:', savedUser);

    // Preparar respuesta sin contraseña
    const userResponse = {
      id: newUser._id.toString(),
      usuario: newUser.usuario,
      nombreApellido: newUser.nombreApellido,
      email: newUser.email,
      rol: newUser.rol,
      membresia: newUser.membresia
    };

    return Response.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 