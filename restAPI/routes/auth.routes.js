const { Router } = require('express')
const User = require('./../models/User')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()


//  /api/register
router.post('/register',
    body('email', 'Wrong email').isEmail(),
    body('password', 'Minimum password length is 6 sympols').isLength({ min: 6 }),
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong data during registration'
                })
            }
            const { email, password, rememberMe, login } = req.body
            const candidate = await User.findOne({ "email": email })
            if (candidate) {
                return res.status(400).json({ message: " User with that name alreagy exists " })
            }
            const isAuth = false
            const hashedPassword = await bcrypt.hash(password, 12)
            console.log(req.body)
            const user = new User({ ...req.body })
            await user.save()
            res.status(201).json({ message: 'User created successfully ' })
        } catch (error) {
            res.status(500).json({ message: 'Something wrong, try again' })
        }
    })

//  /api/login
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
            if (!user) {
                return res.status(400).json({ message: "User didn't found" })
            }
            //const isMatch = await bcrypt.compare(password, user.password)
            if (password != user.password) {
                return res.status(400).json({ message: 'Incorrect password, try again' })
            }
            await User.findByIdAndUpdate(user._id, { isAuth: true })
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            res.json({
                resultCode: 0,
                messages: [],
                data: {
                    id: user.id,
                    email: user.email,
                    login: user.login,
                    token
                }
            })
        } catch (error) {
            res.status(500).json({ message: 'Something wrong, try again' })
        }
    })

 //  /api/users
router.get('/users', async (req, res) => {
    try {
        const usersArr = await User.find()
        const items = usersArr.map(item => {
            return {
                id: 18000,
                name: item.profileInfo.fullName,
                status: item.profileInfo.status,
                photos: {
                    small: "item.photos.small",
                    large: "item.photos.large",
                },
                followed: true
            }
        })
        res.status(200).json({
            items,
            totalCount: 4,
            error: ""
        })
    } catch (e) {
        res.status(500).json(e)
    }
})

//  /api/logout

router.delete('/logout', async (req, res) => {
    try {
        const id = "6129fbd8ec114ea2874f92ca"
        await User.findByIdAndUpdate(id, { isAuth: false })
    } catch (error) {
        res.status(500).json(error) 
    }
})



module.exports = router