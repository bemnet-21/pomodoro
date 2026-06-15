import mongoose from "mongoose"
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

    const objectId = new mongoose.Types.ObjectId(userId);

    const aggregateData = await session.aggregate([
        { $match: { user: objectId, status: "completed" } },
        { $group: {
            _id: null,
            totalMinutes: { $sum: { $divide: ["$actualDurationSeconds", 60] } },
            totalSession: { $sum: 1 },
        }}
    ])

    const uniqueDatesAgg = await session.aggregate([
        { $match: { user: objectId, status: "completed" } },
        { $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } } 
        }},
        { $sort: { _id: -1 } } 
    ]);

    const workedDates = uniqueDatesAgg.map(d => d._id);

    let calculatedStreak = 0;
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    let currentDateToCheck = new Date();
    const todayStr = formatDate(currentDateToCheck);
    
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = formatDate(yesterdayDate);

    if (workedDates.includes(todayStr)) {
    } else if (workedDates.includes(yesterdayStr)) {
        currentDateToCheck = yesterdayDate; 
    } else {
        workedDates.length = 0; 
    }

    while (workedDates.includes(formatDate(currentDateToCheck))) {
        calculatedStreak++;
        currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
    }

    const summary = {
        currentStreak: calculatedStreak,
        totalFocusHours: Math.round(aggregateData[0]?.totalMinutes || 0),
        totalSessions: aggregateData[0]?.totalSession || 0,
        lastActive: userData.stats?.lastActive || new Date()
    }
    
    return summary;
}