import { accessCookieOptions,  refreshCookieOption } from "../constants.js";
import { User } from "../models/user.modle.js";
import APIError from "../utils/APIError.js";
import APIResponse from "../utils/APIResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAcessAndRefreshToken=async(newUser)=>{
  const accessToken=await newUser.generateAccessToken()
  const refreshToken=await newUser.generateRefreshToken()
  newUser.refreshToken=refreshToken
  newUser.save()
  return {newUser,accessToken,refreshToken}
}

const createUser=asyncHandler(async(req,res)=>{
  const {userName,email,password}=req.body
  if (userName=="" || email=="" || password=="")  throw new APIError(400,"Required userName, email and password ")
  const isExists=await User.findOne({email})
  if(isExists) throw new APIError(409,"user already exists")
  const user=await User.create({userName,email,password})
  const data=user.toObject()
  delete data.password
  return res.status(201)
  .json(new APIResponse(201,"user successfully created",data))
})


const loginUser=asyncHandler(async(req,res)=>{
  const {userName,password}=req.body
  if (userName=="" || password=="")  throw new APIError(400,"Required email and password")
  const user=await User.findOne({userName})
  if(!user) throw new APIError(400,"User doesnt exists please singup")
  const validatePassword=await user.comparePassword(password)
  if(!validatePassword) throw new APIError(409,"Incorrect password or email")
  const {newUser,accessToken,refreshToken}=await generateAcessAndRefreshToken(user)
  const data=newUser.toObject()
  delete data.password
  return res
    .status(200)
    .cookie("accessToken",accessToken,accessCookieOptions)
    .cookie("refreshToken",refreshToken,refreshCookieOption)
    .json(new APIResponse(200,"user successfully logged in",{...data,accessToken}))
})

const logoutUser=asyncHandler(async(req,res)=>{
  const {refreshToken}=req.body
  if (!refreshToken) throw new APIError(401,"Refresh token required")
  const user=await User.findOne({_id:req.id,refreshToken})
  if(!user) throw new APIError(401,"Invalid refresh token")
  user.refreshToken=null
  user.save()
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new APIResponse(200,"user successfully logged out"))
})

const reAuthUser=asyncHandler(async(req,res)=>{
  const {refreshToken}=req.body
  if (!refreshToken) throw new APIError(401,"Refresh token required")
  const user=await User.findOne({_id:req.id,refreshToken})
  if(!user) throw new APIError(401,"Invalid refresh token")
  const {newUser,accessToken,refreshToken:newRefreshToken}=await generateAcessAndRefreshToken(user)
  const data=newUser.toObject()
  delete data.password
  return res
    .status(200)
    .cookie("accessToken",accessToken,accessCookieOptions)
    .cookie("refreshToken",newRefreshToken,refreshCookieOption)
    .json(new APIResponse(200,"user successfully refreshed",{...data,accessToken}))
})
export {createUser,loginUser,logoutUser,reAuthUser}
