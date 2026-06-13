import { CreateSessionPayload } from "../components/history/HistoryDashboard"
import apiClient from "./client"

export const getRecentSessionLogs = async (limit: number) => {
    return await apiClient.get(`/session?limit=${limit}`)
}

export const deleteSessionLog = async (id: string) => {
    return await apiClient.delete(`/session/${id}`)
}

export const addSessionLog = async (logData: CreateSessionPayload) => {
    return await apiClient.post(`/session/create`, logData)
}