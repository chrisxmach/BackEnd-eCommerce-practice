const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Product } = require('../models/product');
const { Category } = require('../models/category');


router.get(`/`, async (req,res) => {
    try{
        let filter = {}
        if (req.query.categories) {
            filter = {category: req.query.categories.split(',')};
        }
        const productList =  await Product.find(filter).populate('category');
        if (!productList) {
            return res.status(500).json({
                success: false
            })
        } 
        return res.status(200).send(productList)
        
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.get('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Product id'
        })
        
    }
    try {
        const {id} = req.params
        const product = await Product.findById(id).populate('category');
        if (!product) {
            return res.status(400).json({
                success: false,
                message: `There is not a product with id: ${id}`
            })
        }
        return res.status(200).json(product);
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.post(`/`, async (req,res) => {
    try{        
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Category'
            })
        }

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        })
        product = await product.save()
    
        if (!product) {
            return res.status(500).json({
                success: false,
                message: 'The product cannot be created'
            })
        }
        return res.status(201).json(product);
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.delete('/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Product id'
        })
        
    }
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'The product is deleted'
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                error: err
            })
        })
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Product id'
        })
        
    }
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Category'
            })
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            },
            {new: true}
        )
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product cannot be updated'
            })
        }

        return res.status(200).json(product)
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.get('/get/count', async (req, res) =>{
    try {
        const productsCount = await Product.countDocuments();
        if (!productsCount) {
            return res.status(500).json({
                success: false,
                message: 'Error'
            })
        }
        return res.status(200).json({
            success: true,
            count: productsCount
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.get('/get/featured/:count', async (req, res) =>{
    try {
        const  count  = req.params.count ? req.params.count : 0;
        console.log(count);
        const products = await Product.find({isFeatured: true}).limit(+count);
        if (!products) {
            return res.status(500).json({
                success: false,
                message: 'Error'
            })
        }
        return res.status(200).json(products);
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router;