import mongoose from 'mongoose';

const geneticSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  thc: String,
  stock: {
    type: Number,
    default: 0
  },
  precio: {
    type: Number,
    required: true
  },
  descripcion: String,
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Genetic = mongoose.models.Genetic || mongoose.model('Genetic', geneticSchema);
export default Genetic; 