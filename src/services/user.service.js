import userEmail from "../email/user.email.js"
import CustomError from "../errors/custom.error.js"
import { User } from "../models/user.model.js"
import { comparePassword, generateOtpExpiry, hashPassword, otpCode } from "../utils/helper.utilis.js"

class UserService {

  createUserService = async(username, email, password) => {
    try{
      const otp = otpCode()
      const otpExpiry = generateOtpExpiry()
      const hashedPassword = hashPassword(password)

      const user = await User.create({
        username,
        email,
        password:hashedPassword,
        otp,
        otpExpiry,
      })

      userEmail.sendOtp('Account Verification', email, user.username, otp)
      return user
    }
    catch (error) {
      if(error.code === 11000) {
        throw new CustomError('User already Exist', 400)
      }

      throw new CustomError('Failed To Create User', 500)
    }
  }

  #emailExists = async(email) => {
    const emailExists =  await User.findOne({email})
    return !!emailExists
  }

  //This returns the user's password
  #getUserEmail = async(email) => {
    const emailExists = await User.findOne({email})
    return emailExists
  }


  loginUserService = async(email, password) => {
    try {
      const emailExists = await this.#emailExists(email)

      if(!emailExists) {
       throw process.env.NODE_ENV !== 'production' ? new CustomError('Email Not Found', 404) : new CustomError('Invalid Credentials', 401)
      }

      const user = await this.#getUserEmail(email)
      console.log('User Details =>', user)

      const isMatch = comparePassword(password, user.password)

      if(!isMatch) {
        throw new CustomError('Invalid Credentials, 401')
      }

      if(!user.status) {
        throw new CustomError('Account Not Verified Kindly Verify your Account to Login...', 401)
      }

      if(user.banned) {
        throw new CustomError('Sorry.....Your Account Has Been Banned. You Can Appeal This Ban.', 403)
      }
      return user
    }
    catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw process.env.NODE_ENV ===! 'production' ? new CustomError(error.message, error.statusCode || 500, error.stack)  : new CustomError(error.message, error.statusCode || 500)
    }
  }

  // resendOtpService = async (email) => {
  //   try {
  //     const emailExists = await this.#emailExists(email)

  //     if(!emailExists) {
  //      throw process.env.NODE_ENV !== 'production' ? new CustomError('Email Not Found', 404) : new CustomError('Invalid Credentials', 401)
  //     }

  //     const otp = otpCode()
  //     const otpExpiry = generateOtpExpiry()

  //     const result = await User.updateOne(
  //       { email },                       
  //       { otp, otpExpiry }
  //     );
  //     const user = await this.#getUserEmail(email)

  //     if(!user) {
  //       throw new CustomError('User Not Found', 400)
  //     }

  //     if(user.status) {
  //       throw new CustomError('Account Already Activated', 400)
  //     }

  //     userEmail.sendOtp(email, otp)
  //     console.log('User Details =>', user)

  //     return result;

  //   } catch (error) {
  //     if(error instanceof CustomError) {
  //       throw error
  //     }
  //     throw new CustomError(error.message, error.statusCode || 500)
  //   }
  // }

  //Resend Of OTP
  //This function helps to resend the OTP if the user's OTP ha s expired @params {string} email - The email of the user requesting a new OTP 

  resendOtpService = async (email) => {
    try {
      const user = await this.#getUserEmail(email)

      if(!user) {
        throw new CustomError('User Not Found', 400)
      }

      if(user.status) {
        throw new CustomError('Account Already Activated', 400)
      }

      if(user.otpExpiry > new Date()) {
        throw new CustomError('OTP Is Still Valid......Kindly Use The Prevoius OTP Sent To You', 200)
      }

      const otp = otpCode()
      user.otp = otp

      const otpExpiry = generateOtpExpiry()
      user.otpExpiry = otpExpiry
      await user.save()
      await userEmail.sendOtp('Resend OTP', email, user.username, otp)
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(error.message, error.statusCode || 500)
    }
  }


  activateAccountService = async(otp, email) => {
    try {
      const user = await this.#getUserEmail(email)

      if(!user) {
        throw new CustomError('User Not Found', 400)
      }

      if(user.otp !== otp) {
        throw new CustomError('Invalid OTP', 400)
      }

      if(user.status) {
        throw new CustomError('Account Already Activated', 400)
      }

      if(user.otpExpiry < new Date()) {
        throw new CustomError('OTP Expired.....Please request a new One', 400)
      }
      user.status = true
      user.otp = null
      user.otpExpiry = null
      await user.save()
      return user

    } catch (error) {
      if(error instanceof CustomError) {
        throw error
      }
      throw new CustomError(error.message, error.statusCode || 500)
    }
  }
}

const userService = new UserService();

export default userService;