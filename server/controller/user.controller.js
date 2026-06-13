import z from "zod"
import { getUserSettingsService, getUserSummaryService, updateUserSettingsService } from "../service/user.service.js"
import { AppError } from "../utils/AppError.js"
// import { getUserSettingsService } from "../service/user.service"

export const getUserSettings = async (req, res) => {
    try {
        const userId = req.user.id
        const settings = await getUserSettingsService(userId)
        res.status(200).json({
            message: "User settings retrieved successfully",
            data: settings
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

const userSettingsSchema = z.object({
    workDuration: z.number().min(1).max(180).optional(),
    shortBreak: z.number().min(1).max(60).optional(),
    longBreak: z.number().min(1).max(60).optional(),
    longBreakInterval: z.number().min(1).max(10).optional(),
    autoStartBreaks: z.boolean().optional(),
    autoStartWork: z.boolean().optional(),
    alarmSound: z.string().optional(),
    volume: z.number().min(0).max(100).optional()
})
export const updateUserSettings = async (req, res) => {
    try {
        const userId = req.user.id
        const parsedData = userSettingsSchema.safeParse(req.body)
        if(!parsedData.success) {
            return res.status(400).json({ error: "Invalid settings data", details: parsedData.error.issues.map(e => e.message) })
        }
        const updatedSettings = await updateUserSettingsService(userId, parsedData.data)
        res.status(200).json({
            message: "User settings updated successfully",
            data: updatedSettings
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

export const getUserSummary = async (req, res) => {
    try {
        const userId = req.user.id
        const summary = await getUserSummaryService(userId)
        res.status(200).json({
            message: "User summary retrieved successfully",
            data: summary
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