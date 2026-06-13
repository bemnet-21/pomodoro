import apiClient from "./client"

export const login = async (username: string, password: string) => {
    return await apiClient.post("/auth/login", { username, password })
}

export const signup = async (username: string, email: string, password: string) => {
    return await apiClient.post("/auth/signup", { username, email, password })
}

export const getProfile = async () => {
    return await apiClient.get("/auth/me")
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    return await apiClient.post("/auth/change-password", { currentPassword, newPassword })
}