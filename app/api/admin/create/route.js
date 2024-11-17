import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

// Manejador para GET (para verificar si la ruta funciona)
export async function GET(req) {
  return Response.json({ message: "Ruta de creación de admin disponible" });
}

// Manejador para POST (para crear el admin)
export async function POST(req) {
  try {
    await dbConnect();

    // Datos del administrador
    const adminData = {
      usuario: "admin",
      password: "admin123456",
      nombreApellido: "Administrador Principal",
      email: "admin@fantaseeds.com",
      domicilio: {
        calle: "Calle Principal",
        numero: "123",
        codigoPostal: "1234",
        ciudad: "Ciudad",
        provincia: "Provincia"
      },
      rol: "administrador",
      membresia: "10G"
    };

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ usuario: "admin" });
    
    if (existingAdmin) {
      return Response.json({
        success: false,
        message: "Ya existe un usuario administrador",
        admin: {
          usuario: existingAdmin.usuario,
          email: existingAdmin.email,
          rol: existingAdmin.rol
        }
      });
    }

    // Crear el admin
    const admin = await User.create(adminData);
    
    console.log('Admin creado:', admin); // Para debugging

    return Response.json({
      success: true,
      message: "Administrador creado exitosamente",
      admin: {
        usuario: admin.usuario,
        email: admin.email,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('Error completo:', error);
    return Response.json(
      { 
        success: false, 
        message: "Error al crear administrador",
        error: error.message,
        stack: error.stack // Para ver el stack trace completo
      },
      { status: 500 }
    );
  }
} 