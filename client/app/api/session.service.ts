import apiClient from "./client"

export const getRecentSessionLogs = async () => {
    return await apiClient.get("/session?limit=5")
}