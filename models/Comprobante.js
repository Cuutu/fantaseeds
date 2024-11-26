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
  nombreArchivo: {
    type: String,
    required: true
  },
  tipoArchivo: {
    type: String,
    required: true
  },
  fechaSubida: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Comprobante || mongoose.model('Comprobante', comprobanteSchema); 