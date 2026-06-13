import { getDistributionService, getHeatMapService, getScoreService, getWeeklyStatsService } from "../service/analytics.service.js";
import { AppError } from "../utils/AppError.js";

export const getHeatMap = async (req, res) => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const heatMapData = await getHeatMapService(req.user.id, oneYearAgo);

        res.status(200).json({
            message: 'Heatmap data retrieved successfully',
            data: heatMapData
        })

    } catch(err) {
        console.error('Error fetching heatmap data:', err);
        if(err instanceof AppError) {
            return res.status(err.statusCode).json({ error: err.message });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }

    }
}

export const getWeeklyStats = async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);

        const weeklyStatsData = await getWeeklyStatsService(req.user.id, startOfWeek);

        res.status(200).json({
            message: 'Weekly stats data retrieved successfully',
            data: weeklyStatsData
        });

    } catch(err) {
        console.error('Error fetching weekly stats:', err);
        if(err instanceof AppError) {
            return res.status(err.statusCode).json({ error: err.message });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }   
    }
}

export const getDistribution = async (req, res) => {
    try {
        const distribution = await getDistributionService(req.user.id);
        res.status(200).json({
            message: 'Distribution data retrieved successfully',
            data: distribution
        });
    } catch(err) {
        console.error('Error fetching distribution data:', err);
        if(err instanceof AppError) {
            return res.status(err.statusCode).json({ error: err.message });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export const getScore = async (req, res) => {
    try {
        const { score, totalStarted, totalCompleted } = await getScoreService(req.user.id);
        res.status(200).json({
            message: 'Score data retrieved successfully',
            data: { score, totalStarted, totalCompleted }
        });
    } catch(err) {
        console.error('Error fetching score data:', err);
        if(err instanceof AppError) {
            return res.status(err.statusCode).json({ error: err.message });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}