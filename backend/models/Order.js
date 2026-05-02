const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ 
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            validate: {
                validator: function(v) {
                    // Allow ObjectId format or skip validation for demo data
                    return !v || /^[0-9a-fA-F]{24}$/.test(v);
                },
                message: 'Product ID must be a valid ObjectId'
            }
        },
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    customization: { type: mongoose.Schema.Types.ObjectId, ref: 'Customization' },
    paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
