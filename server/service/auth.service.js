import User from '../model/user.js';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError.js';

export const signupService = async (username, email, password) => {
    const existingUser = await User.findOne({ email })
    if(existingUser) {
        throw new AppError("Email already in use", 400)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await User.create({ username, email, password: hashedPassword })
    return {  id: result._id, username: result.username, email: result.email }
}

export const loginService = async (email, password) => {
    const foundUser = await User.findOne({ email })
    if(!foundUser) {
        throw new AppError("Invalid email or password", 400)
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    if(!isPasswordValid) {
        throw new AppError("Invalid email or password", 400)
    }
    return { id: foundUser._id, username: foundUser.username, email: foundUser.email }
}