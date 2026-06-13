import mongoose from "mongoose"
import session from "../model/session.js"

export const getHeatMapService = async (userId, startTime) => {
    const data = await session.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                status: 'completed',
                startTime: { $gte: startTime }
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
                count: { $sum: 1 }
            },
        },
        { $sort: { _id: 1 } }
    ])
    return data
}

export const getWeeklyStatsService = async (userId, startOfWeek) => {
    const data = await session.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                startTime: { $gte: startOfWeek },
                sessionType: 'work',
            },
        },
        {
            $group: {
                _id: {$dayOfWeek: "$startTime"},
                totalMinutes: { $sum: { $divide: ["$actualDurationSeconds", 60] } },
                date: { $first: "$startTime" }
            }
        },
        { $sort: { "_id": 1 }}
            
    ])
    return data
}

export const getDistributionService = async (userId, startOfWeek) => {
    const data = await session.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                sessionType: 'work',
                status: 'completed',
            }
        },
        { $unwind: "$tags" },
        {
            $group: {
                _id: "$tags",
                totalMinutes: { $sum: { $divide: ["$actualDurationSeconds", 60] } },
            }
        },
        { $sort: { totalMinutes: -1 } }
    ])

    return data
}

export const getScoreService = async (userId) => {
    const scoreData = await session.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                sessionType: 'work',
            }
        },
        {
            $group: {
                _id: null,
                totalStarted: { $sum: 1 },
                totalCompleted: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                    }
                }
            }
        }
    ])
    const stats = scoreData[0] || { totalStarted: 0, totalCompleted: 0 };
    const score = stats.totalStarted > 0 ? Math.round((stats.totalCompleted / stats.totalStarted) * 100) : 0;

    return { score, ...stats}
}