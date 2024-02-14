const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    country: String,
    user: String,
})

exports.Order = mongoose.model('Order', orderSchema);