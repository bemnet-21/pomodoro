import { UserSettings } from "../types/profile"
import apiClient from "./client"

export const getUserSummary = async () => {
    return await apiClient.get("/user/stats/summary")
}

export const updateUserSettings = async (settings: Partial<UserSettings>) => {
    return await apiClient.patch("/user/settings", settings)
}

export const getUserSettings = async () => {
    return await apiClient.get("/user/settings")
}