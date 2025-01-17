import mongoose from 'mongoose';

const geneticSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  thc: {
    type: Number,
    required: [true, 'El % THC es requerido']
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  stockDisponible: {
    type: Number,
    required: true,
    default: 0,
    get: v => Math.round(v),
    set: v => Math.round(v)
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
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Middleware para sincronizar stock y stockDisponible si es necesario
geneticSchema.pre('save', function(next) {
  if (this.isNew && !this.stockDisponible) {
    this.stockDisponible = this.stock;
  }
  next();
});

export default mongoose.models.Genetic || mongoose.model('Genetic', geneticSchema); 