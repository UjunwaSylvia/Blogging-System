import bcrypt from "bcryptjs";
import {randomInt} from 'crypto';
import jwt from "jsonwebtoken"

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword
}

export const otpCode = () => {
  const otp = randomInt(100000, 999999)
  return otp
}

export const comparePassword = async (userPassword, hashPassword) => {
  const isMatch = await bcrypt.compare(userPassword, hashPassword)
  return isMatch
}

export const generateOtpExpiry = () => {
  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 5);
  return otpExpires;
}

export const generateToken = (user, userId) => {
  const secretKey = process.env.JWT_SECRET;
  if(!secretKey) {
    throw new Error('Secret Key not Set...')
  }
  const token = jwt.sign({user, userId},secretKey , {
    expiresIn: '1d'
  })

  return token;
}