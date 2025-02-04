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
    cantidad: Number,
    precio: Number
  }],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['mercadopago', 'transferencia'],
    required: true
  },
  metodoEntrega: {
    type: String,
    enum: ['envio', 'retiro'],
    required: true
  },
  direccionEnvio: {
    calle: String,
    numero: String,
    localidad: String,
    provincia: String,
    codigoPostal: String
  },
  informacionCliente: {
    nombre: String,
    apellido: String,
    email: String,
    telefono: String
  },
  createdAt: {
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