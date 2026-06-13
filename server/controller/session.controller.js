
import { z } from 'zod';
import {
    createSessionService,
    getSessionByIdService,
    getSessionsService,
    deleteSessionByIdService
} from '../service/session.service.js';
import { AppError } from '../utils/AppError.js';

const sessionSchema = z.object({
    taskName: z.string().min(1, "Task name is required"),
    sessionType: z.enum(['work', 'short-break', 'long-break'], "Invalid session type"),
    status: z.enum(['completed', 'abandoned'], "Invalid session status").optional(),
    startTime: z.string().refine(dateStr => !isNaN(Date.parse(dateStr)), "Invalid start time"),
    endTime: z.string().refine(dateStr => !isNaN(Date.parse(dateStr)), "Invalid end time"),
    actualDurationSeconds: z.number().int().positive("Actual duration must be a positive integer"),
    plannedDurationSeconds: z.number().int().positive("Planned duration must be a positive integer"),
})
export const createSession = async (req, res) => {
    try {
        const parsedData = sessionSchema.safeParse(req.body)
        if(!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.issues.map(e => e.message).join(', ') })
        }
        const userId = req.user.id
        const sessionData = { ...parsedData.data, user: userId }
        const newSession = await createSessionService(sessionData)
        res.status(201).json({
            message: "Session created successfully",
            data: newSession
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

export const getSessions = async (req, res) => {
    try {
        const userId = req.user.id
        const sessions = await getSessionsService(userId)
        res.status(200).json({
            message: "Sessions retrieved successfully",
            data: sessions
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

const getSessionSchema = z.object({
    sessionId: z.string().refine(id => /^[0-9a-fA-F]{24}$/.test(id), "Invalid session ID")
})

export const getSessionById = async (req, res) => {
    try {
        const parsedParams = getSessionSchema.safeParse(req.params)
        if(!parsedParams.success) {
            return res.status(400).json({ error: parsedParams.error.issues.map(e => e.message).join(', ') })
        }
        const sessionId = parsedParams.data.sessionId
        const session = await getSessionByIdService(sessionId)
        res.status(200).json({
            message: "Session retrieved successfully",
            data: session
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

export const deleteSession = async (req, res) => {
    try {
        const parsedParams = getSessionSchema.safeParse(req.params)
        if(!parsedParams.success) {
            return res.status(400).json({ error: parsedParams.error.issues.map(e => e.message).join(', ') })
        }
        const sessionId = parsedParams.data.sessionId
        await deleteSessionByIdService(sessionId)
        res.status(200).json({
            message: "Session deleted successfully"
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