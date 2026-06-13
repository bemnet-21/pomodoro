import apiClient from "./client"

export const getHeatmapData = async () => {
    return await apiClient.get("/analytics/heatmap")
}

export const getWeeklyData = async () => {
    return await apiClient.get("/analytics/weekly-stats")
}

export const getDistributionData = async () => {
    return await apiClient.get("/analytics/distribution")
}

export const getProductivityScore = async () => {
    return await apiClient.get("/analytics/productivity-score")
}