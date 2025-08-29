import CustomError from "../../errors/custom.error.js";
import adminService from "../../services/admin/admin.service.js"

class AdminController {
  
  constructor() {
    this.adminService = adminService;
  }


  deletePost = async(req, res, next) => {
    const { blogId } = req.params;

    try {
      await this.adminService.deletePost(blogId);
      res.status(200).json({
        status: true,
        message: 'Blog Post Deleted Successfully'
      })
    } catch (error) {
      next(error);
    }
  }


  banUser = async(req, res, next) => {
    const {userId} = req.params;

    try {
      const updatedUser = await this.adminService.banUser(userId);

      res.status(201).json ({
        success: true,
        message: 'User Banned Successfully...',
        data: updatedUser.banned
      })
    } catch (error) {
      next(error);
    }
  }

  UnbanUser = async(req, res, next) => {
    const {userId} = req.params;

    try {
      const UnBannedUser = await this.adminService.UnBanUser(userId);
      res.status(200).json ({
        success: true,
        message: 'User Un-Banned Successfully...',
        data: UnBannedUser.banned
      })
    } catch (error) {
      next(error);
    }
  }
}


const adminController = new AdminController();

export default adminController;