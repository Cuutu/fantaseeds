import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function uploadImage(file) {
  try {
    // Asegurarnos de que existe el directorio de uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear un nombre único para el archivo
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const fileName = `comprobante-${timestamp}-${originalName}`;

    // Definir la ruta donde se guardará el archivo
    const filePath = path.join(uploadDir, fileName);

    // Guardar el archivo
    await writeFile(filePath, buffer);

    // Retornar la URL relativa del archivo
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('Error al subir la imagen');
  }
} 