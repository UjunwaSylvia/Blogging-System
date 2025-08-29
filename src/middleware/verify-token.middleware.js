import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyToken = async(req, res, next) => {

  const test_token = req.headers.authorization || req.headers.Authorization;
  let token;

  if(test_token && test_token.startsWith('Bearer')) {
    token = test_token.split(' ')[1];
  }

  if(!token) {
    return res.status(403).json ({
      success: false,
      message: 'Not authorized, no token provided...'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId);
    console.log(user, 'from middleware')

    if(!token) {
      return res.status(404).json({
        success: false,
        message: 'User not Found'
      })
    }
    req.user = user;

    next();
  }
  catch (error) {
    if(error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid Token...',
        stack: error.stack
        
      })
    }

    if(error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token Expired...',
        stack: error.stack
      })
    }

    //Generic error handling
    res.status(500).json({
      success: false,
      message: 'Not Authorized, Token Failed...',
      error: process.env.NODE_ENV !== 'production' ? error.message : '',
      stack: process.env.NODE_ENV !== 'production' ? error.stack : ''
    });
  }
}