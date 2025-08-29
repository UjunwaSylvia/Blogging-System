import { Router } from "express";
import { verifyToken } from "../middleware/verify-token.middleware.js";
import adminController from "../controllers/admin/admin.controller.js";
import adminAccess from "../middleware/admin-access.middleware.js";
import adminService from "../services/admin/admin.service.js";

const adminRouter = Router();


adminRouter.delete('/delete/:blogId', verifyToken, adminAccess.checkAdmin, adminController.deletePost);
adminRouter.patch('/ban-user/:userId', verifyToken, adminAccess.checkAdmin, adminController.banUser);
adminRouter.patch('/unban-user/:userId', verifyToken, adminAccess.checkAdmin, adminController.UnbanUser)

export default adminRouter;