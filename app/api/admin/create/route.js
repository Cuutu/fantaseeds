import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Manejador para GET (para verificar si la ruta funciona)
export async function GET(req) {
  return Response.json({ message: "Ruta de creación de admin disponible" });
}

// Manejador para POST (para crear el admin)
export async function POST(req) {
  try {
    await dbConnect();

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ usuario: "admin" });
    
    if (existingAdmin) {
      // Si existe, actualizar su contraseña
      const hashedPassword = await bcrypt.hash("admin123456", 10);
      await User.findOneAndUpdate(
        { usuario: "admin" },
        { $set: { password: hashedPassword } }
      );

      return Response.json({
        success: true,
        message: "Contraseña de administrador actualizada",
        admin: {
          usuario: existingAdmin.usuario,
          email: existingAdmin.email,
          rol: existingAdmin.rol
        }
      });
    }

    // Si no existe, crear nuevo admin
    const hashedPassword = await bcrypt.hash("admin123456", 10);
    
    const adminData = {
      usuario: "admin",
      password: hashedPassword,
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

    const admin = await User.create(adminData);

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
        error: error.message
      },
      { status: 500 }
    );
  }
} 