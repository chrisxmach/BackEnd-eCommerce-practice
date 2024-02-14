const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { User } = require('../models/user')
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const users = await User.find().select('-passwordHash')
    if (!users) {
        res.status(500).json({
            success: false,
        })
    }
    res.status(200).json(users)
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash')
        if (!user) {
            res.status(404).json({
                success: false,
                message: `There is not a user whit id: ${req.params.id}`,
            })
        }
        res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            isAdmin,
            city,
            country,
            street,
            apartment,
            zip,
        } = req.body

        let user = new User({
            name,
            email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone,
            isAdmin,
            city,
            country,
            street,
            apartment,
            zip,
        })
        user = await user.save()
        if (!user) {
            return res.status(400).send('The user cannot be created')
        }
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            })
        }

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                // eslint-disable-next-line no-undef
                process.env.SECRET_KEY,
                {
                    expiresIn: '1d'
                }
            )
            return res.status(200).json({
                success: true,
                user: user.email,
                token,
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Wrong user or password',
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        })
    }
})

router.post('/register', async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            isAdmin,
            city,
            country,
            street,
            apartment,
            zip,
        } = req.body

        let user = new User({
            name,
            email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone,
            isAdmin,
            city,
            country,
            street,
            apartment,
            zip,
        })
        user = await user.save()
        if (!user) {
            return res.status(400).send('The user cannot be created')
        }
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err,
        })
    }
})

router.get('/get/count', async (req, res) =>{
    try {
        const usersCount = await User.countDocuments();
        if (!usersCount) {
            return res.status(500).json({
                success: false,
                message: 'Error'
            })
        }
        return res.status(200).json({
            success: true,
            count: usersCount
        });
        
    } catch (err) {
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
            message: 'Invalid User id'
        })
        
    }
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: 'The user is deleted'
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'user not found'
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

module.exports = router
