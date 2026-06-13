import { z } from 'zod';
import { changePasswordService, getUserByIdService, loginService, signupService } from '../service/auth.service.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../utils/AppError.js';

const signupSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6)
})
export const signup = async (req, res) => {
    try {
        const parsedData = signupSchema.safeParse(req.body)
        if(!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.issues.map(e => e.message).join(', ') })
        }

        const { username, email, password } = parsedData.data
        const result = await signupService(username, email, password)
        const userData = { id: result.id, username: result.username, email: result.email }
        const token = generateToken(userData)

        res.status(201).json({
            message: "User registered successfully",
            user: userData,
            token
        })

    } catch(err) {
        console.error(err)
        if(err instanceof AppError) {
            res.status(err.statusCode).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
export const login = async (req, res) => {
    try {
        const parsedData = loginSchema.safeParse(req.body)
        if(!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.issues.map(e => e.message).join(', ') })
        }
        const result = await loginService(parsedData.data.email, parsedData.data.password)
        const userData = { id: result.id, username: result.username, email: result.email }
        const token = generateToken(userData)
        
        res.status(200).json({
            message: "Login successful",
            user: userData,
            token
        })

    } catch(err) {
        console.error(err)
        if(err instanceof AppError) {
            res.status(err.statusCode).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

export const me = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await getUserByIdService(userId)
        res.status(200).json({
            message: "User retrieved successfully",
            user
        })
    } catch(err) {
        console.error(err)
        if(err instanceof AppError) {
            res.status(err.statusCode).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6)
})
export const changePassword = async (req, res) => {
    try {
        const parsedData = changePasswordSchema.safeParse(req.body)
        if(!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.issues.map(e => e.message).join(', ') })
        }

        const { currentPassword, newPassword } = parsedData.data
        const userId = req.user.id
        const result = await changePasswordService(userId, currentPassword, newPassword)
        res.status(200).json({
            message: result.message
        })
    } catch(err) {
        console.error(err)
        if(err instanceof AppError) {
            res.status(err.statusCode).json({ error: err.message })
        } else {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
}