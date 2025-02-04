import mongoose from 'mongoose';

const comprobanteSchema = new mongoose.Schema({
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  archivo: {
    type: Buffer,
    required: true
  },
  nombreArchivo: String,
  tipoArchivo: String,
  tamano: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Comprobante || mongoose.model('Comprobante', comprobanteSchema); 