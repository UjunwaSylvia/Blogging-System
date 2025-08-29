import CustomError from "../errors/custom.error.js";

class AdminAccess {

  checkAdmin = async(req, res, next) => {
    //Check if User Exists
    try {
      if(!req.user) {
        throw new CustomError('Unauthorized, User Not Found', 404);
      }

      const user = req.user;
      console.log(user , 'from admin page')
      if(user.role !== 'admin') {
        throw new CustomError('Unauthorized, Adim Access Only', 403)
      }
      next();
    } catch (error) {
      res.status(500).json ({
        status: false,
        message: error.message,
      })
    }
  }
}



const adminAccess = new AdminAccess();

export default adminAccess;