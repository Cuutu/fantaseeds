import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const admin = await User.findOne({ usuario: 'admin' });
    
    return Response.json({
      exists: !!admin,
      role: admin?.rol,
      email: admin?.email
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 