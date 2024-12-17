import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productos: [{
    genetic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genetic',
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    },
    precio: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'transferencia', 'mercadopago'],
    required: true
  },
  metodoEntrega: {
    type: String,
    enum: ['retiro', 'envio'],
    required: true
  },
  direccionEnvio: {
    type: Object,
    required: function() {
      return this.metodoEntrega === 'envio';
    }
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  },
  pagoId: String,
  estadoPago: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para validar que el total coincida con la suma de productos
orderSchema.pre('save', function(next) {
  const calculatedTotal = this.productos.reduce((sum, producto) => {
    return sum + (producto.cantidad * producto.precio);
  }, 0);
  
  if (Math.abs(calculatedTotal - this.total) > 0.01) {
    this.total = calculatedTotal;
  }
  
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order; 