import apiClient from "./client"

export const getUserSummary = async () => {
    return await apiClient.get("/user/stats/summary")
}