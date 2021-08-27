const { Router } = require('express')
const User = require('./../models/User')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()


//  /api/auth/register
router.post('/register', body('email', 'Wrong email').isEmail(), async (req, res) => {
    // [

    //     check('password', 'Minimum password length is 6 sympols')
    //         .isLength({ min: 6 })
    // ]

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data during registration'
            })
        }
        const { email, password, rememberMe } = req.body
        const candidate = await User.findOne({ "email": email })
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
router.post('/login',
    [
        body('email', 'Write correct email').isEmail(),
        body('password', 'Enter the password').exists()
    ],
    async (req, res) => {
        try {
            console.log(req.body)
            const errors = validationResult(req)
            if (!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong data during login'
                })
            }
            const { email, password, rememberMe } = req.body
            console.log(email)
            const user = await User.findOne({ "email": email })
            console.log(user)

            if (!user) {
                return res.status(400).json({ message: "User didn't found" })
            }
            console.log(password)
            console.log(user.password)
            //const isMatch = await bcrypt.compare(password, user.password)
            if (password != user.password) {
                return res.status(400).json({ message: 'Incorrect password, try again' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            // res.status(200).json(user)
            res.json({ token, userId: user.id })
        } catch (error) {
            res.status(500).json({ message: 'Something wrong, try again' })
        }
    })

router.post('/postauths', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body)
        const post = await User.create({ email, password })
        console.log(req.body)
        res.json(post)
    } catch (e) {
        res.status(500).json(e)
    }
})


module.exports = router