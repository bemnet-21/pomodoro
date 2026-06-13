import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDistribution, getHeatMap, getScore, getWeeklyStats } from '../controller/analytics.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/heatmap:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get heatmap data for completed sessions over the last year
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Heatmap data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsHeatmapResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/heatmap', protect, getHeatMap)

/**
 * @swagger
 * /api/analytics/weekly-stats:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get weekly focus statistics for work sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly stats data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsWeeklyStatsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/weekly-stats', protect, getWeeklyStats)

/**
 * @swagger
 * /api/analytics/distribution:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get focus-time distribution grouped by tag
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribution data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsDistributionResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/distribution', protect, getDistribution)

/**
 * @swagger
 * /api/analytics/productivity-score:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get productivity completion score for work sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Score data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsScoreResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/productivity-score', protect, getScore)

export default router;