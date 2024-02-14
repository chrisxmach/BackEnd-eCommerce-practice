const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})
orderSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

orderSchema.set('toJSON',{
    virtuals: true,
})


exports.Order = mongoose.model('Order', orderSchema);


/**
order example: 
{
    "orderItems": [
        { 
            "quantity": 3,
            "product": "65c3a8fcd2d5bffe73706d20"
        },
        { 
            "quantity": 2,
            "product": "65c4e9dce085464a8f2fae5a"
        }
    ],
    "shippingAddress1": "Street 1",
    "shippingAddress2": "S-222",
    "city": "Med",
    "zip": "00000",
    "country": "Bat",
    "phone": "+561231123135",
    "user": "65c539c9cac826042b5bd5dc"
}
 */