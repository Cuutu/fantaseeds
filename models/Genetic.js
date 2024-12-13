import mongoose from 'mongoose';

const geneticSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido']
  },
  thc: {
    type: Number,
    required: [true, 'El % THC es requerido']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido']
  },
  descripcion: String,
  imagen: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Genetic || mongoose.model('Genetic', geneticSchema); 