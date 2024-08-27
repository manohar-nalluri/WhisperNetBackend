import express  from "express"
import verifyAuth from "../middlewares/auth.middleware.js"
import {  getAllFriends, pendingFriendRequest, sendFriendRequest } from "../controllers/friends.controller.js"

const router=express.Router()


router.post('/sendRequest',verifyAuth,sendFriendRequest)
router.get('/requests',verifyAuth,pendingFriendRequest)
router.get('/',verifyAuth,getAllFriends)

export const friendsRouter=router
