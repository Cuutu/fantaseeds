import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombreApellido: { type: String },
  email: { type: String, required: true, unique: true },
  rol: { type: String, default: 'usuario' },
  membresia: { type: String, default: '10G' },
  fechaAlta: { type: Date, default: Date.now },
  domicilio: {
    calle: { type: String, default: '' },
    numero: { type: String, default: '' },
    codigoPostal: { type: String, default: '' },
    ciudad: { type: String, default: '' },
    provincia: { type: String, default: '' }
  },
  activo: { type: Boolean, default: true }
});

// Mantener el middleware de hash de contraseña
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Agregar un middleware para el findOneAndUpdate
userSchema.pre('findOneAndUpdate', function(next) {
  console.log('Update operation:', this.getUpdate()); // Debug
  next();
});

// Eliminar el modelo existente si existe
mongoose.models = {};

// Crear el modelo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 