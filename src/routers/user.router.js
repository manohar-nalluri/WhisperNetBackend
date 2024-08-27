import express from "express";
import { createUser, loginUser, logoutUser, reAuthUser } from "../controllers/user.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

//UnSecured Routes
router.post('/register',createUser)
router.post('/login',loginUser)

//securedRoutes
router.get('/refresh', verifyAuth,reAuthUser)
router.get('/logout', verifyAuth,logoutUser)
export const userRouter = router;

