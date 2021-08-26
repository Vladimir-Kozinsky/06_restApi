const { Router } = require('express')
const User = require('./../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require("express-validator")
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()


//  /api/auth/register
router.post('/register', async (req, res) => {
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Minimum password length is 6 sympols')
            .isLength({ min: 6 })
    ]

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data during registration'
            })
        }
        const { email, password } = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            return res.status(400).json({ message: " User with that name alreagy exists " })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })
        await user.save()
        res.status(201).json({ message: 'User created successfully ' })
    } catch (error) {
        res.status(500).json({ message: 'Something wrong, try again' })
    }
})

//  /api/auth/login
router.post('/login', async (req, res) => {
    [
        check('email', 'Write correct email').normalizeEmail().isEmail(),
        check('password', 'Enter the password').exists()
    ]
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data during login'
            })
        }
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User didn't found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password, try again' })
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        res.json({ token, userId: user.id })
    } catch (error) {
        res.status(500).json({ message: 'Something wrong, try again' })
    }
})


module.exports = router