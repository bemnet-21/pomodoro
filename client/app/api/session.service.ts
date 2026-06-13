import { NewLog } from "../components/history/HistoryDashboard"
import apiClient from "./client"

export const getRecentSessionLogs = async (limit: number) => {
    return await apiClient.get(`/session?limit=${limit}`)
}

export const deleteSessionLog = async (id: string) => {
    return await apiClient.delete(`/session/${id}`)
}

export const addSessionLog = async (logData: NewLog) => {
    return await apiClient.post(`/session/create`, logData)
}