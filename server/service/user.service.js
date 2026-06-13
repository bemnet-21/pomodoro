import session from "../model/session.js"
import user from "../model/user.js"
import { AppError } from "../utils/AppError.js"

export const getUserSettingsService = async (userId) => {
    const userData = await user.findById(userId)
    if(!userData) {
        throw new AppError("User not found", 404)
    }
    return userData.settings
}

export const updateUserSettingsService = async (userId, newSettings) => {
    const updatedUser = await user.findByIdAndUpdate(userId, { settings: newSettings }, { new: true })
    if(!updatedUser) {
        throw new AppError("User not found", 404)
    }
    return updatedUser.settings
}

export const getUserSummaryService = async (userId) => {
    const userData = await user.findById(userId).select("stats")
    if(!userData) {
        throw new AppError("User not found", 404)
    }

    const aggregateData = await session.aggregate([
        { $match: { user: userId, status: "completed" } },
        { $group: {
            _id: null,
            totalMinutes: { $sum: { $divide: ["$stats.totalFocusMinutes", 60] } },
            totalSession: { $sum: 1 },
        }}
    ])

    const summary = {
        currentStreak: userData.stats.currentStreak,
        totalFocusHours: Math.round(aggregateData[0]?.totalMinutes || 0),
        totalSessions: aggregateData[0]?.totalSession || 0,
        lastActive: userData.stats.lastActive
    }
    return summary
}