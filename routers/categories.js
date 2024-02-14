const express = require('express')
const router = express.Router()
const { Category } = require('../models/category')

router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find()
        if (!categoryList) {
            res.status(500).json({
                success: false,
            })
        }
        res.status(200).json(categoryList)
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            res.status(404).json({
                success: false,
                message: `There is not a category whit id: ${req.params.id}`,
            })
        }
        res.status(200).json(category)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, icon, color } = req.body
        let category = new Category({
            name,
            icon,
            color,
        })
        category = await category.save()
        if (!category) {
            return res.status(404).send('The category cannot be created')
        }
        res.status(200).json(category)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'The category is deleted',
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
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

router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },
            { new: true }
        )
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'The category cannot be updated',
            })
        }
        return res.status(200).json(category)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router
