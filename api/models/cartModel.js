const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const CartSchema = mongoose.Schema({
    cartId: { type: String, unique: true, required: true },
    customer: {
        customerId: String,
        email: String
    },
    items: [{
        itemId: String,
        quantity: Number,
        price: Number,
        imageUrl: String,
        uri: String,
        productName: String,
        productCode: String,
        totalPrice: Number
    }],
    coupon: [{
        couponId: String,
        couponName: String,
        couponValue: Number
    }],
    total: Number
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('Cart', CartSchema);