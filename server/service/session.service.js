import Session from '../model/session.js';
import { AppError } from '../utils/AppError.js';

export const createSessionService = async (data) => {
    const newSession = await Session.create(data)
    return newSession
}

export const getSessionsService = async (userId) => {
    const sessions = await Session.find({ user: userId }).sort({ startTime: -1 })
    if(!sessions) return []
    return sessions
}

export const getSessionByIdService = async (sessionId) => {
    const session = await Session.findById(sessionId)
    if(!session) {
        throw new AppError("Session not found", 404)
    }
    return session
}

export const deleteSessionByIdService = async (sessionId) => {
    const deletedSession = await Session.findByIdAndDelete(sessionId)
    if(!deletedSession) {
        throw new AppError("Session not found", 404)
    }
    return deletedSession
}