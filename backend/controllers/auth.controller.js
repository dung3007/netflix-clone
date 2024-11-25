import { User } from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req, res, next) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: 'all fields required'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'invalid email'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'password must be at least 6 characters'
            })
        }

        const existingUserByEmail = await User.findOne({ email: email })
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            })
        }

        const existingUserByUsername = await User.findOne({ username: username })
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image: ''
        })

        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save()
        res.status(201).json({
            success: true,
            message: 'successfully created',
            user: {
                ...newUser._doc,
                password: ''
            }
        })

    } catch (err) {
        console.log("error signup", err)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required!' })
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credenials' })
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Invalid credenials' })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            success: true,
            message: 'successfully login',
            user: {
                ...user._doc,
                password: ''
            }
        })

    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export async function logout(req, res, next) {
    try {
        res.clearCookie("jwt-netflix")
        res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (error) {
        console.log("error in logout controller", error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export async function authCheck(req, res, next) {
    try {
        res.status(200).json({ success: true, user: req.user })
    } catch (error) {
        console.log("error in authCheck controller", error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}