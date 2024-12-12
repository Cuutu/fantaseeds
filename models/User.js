import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombreApellido: String,
  rol: {
    type: String,
    default: 'usuario',
    enum: ['usuario', 'administrador']
  },
  membresia: {
    type: String,
    required: true,
    default: '10G',
    enum: ['10G', '20G', '30G', '40G']
  },
  domicilio: {
    calle: String,
    numero: String,
    codigoPostal: String,
    ciudad: String,
    provincia: String
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaAlta: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pre-save
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  if (!this.membresia) {
    this.membresia = '10G';
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