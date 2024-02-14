const express = require('express')
const router = express.Router()

const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')

router.get('/', async (req, res) => {
    const orderList = await Order.find()
        .populate('user', 'name')
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        })
        .sort({ dateOrdered: -1 })
    if (!orderList) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(orderList)
})

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        })
    if (!order) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(order)
})

router.post('/', async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress1,
            shippingAddress2,
            city,
            zip,
            country,
            phone,
            status,
            user,
        } = req.body

        const orderItmesIds = Promise.all(
            orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                })
                newOrderItem = await newOrderItem.save()
                return newOrderItem.id
            })
        )

        const orderItmesIdsResolved = await orderItmesIds;

        const totalPrices = Promise.all(orderItmesIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price'); 
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }))

        const totalPricesResolved = (await totalPrices).reduce((acc,item) => acc + item, 0);

        let order = new Order({
            orderItems: orderItmesIdsResolved,
            shippingAddress1,
            shippingAddress2,
            city,
            zip,
            country,
            phone,
            status,
            totalPrice: totalPricesResolved,
            user,
        })
        order = await order.save()
        if (!order) {
            return res.status(404).send('The order cannot be created')
        }
        res.status(200).json(order)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            { new: true }
        )
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'The order cannot be updated',
            })
        }
        return res.status(200).json(order)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then( async (order) => {
            if (order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndDelete(orderItem._id)
                })
                
                return res.status(200).json({
                    success: true,
                    message: 'The order is deleted',
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'order not found',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                error: err,
            })
        })
})



module.exports = router
