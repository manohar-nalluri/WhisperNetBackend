import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
  userName:{
    type:"String",
    required:true,
    unique:true
  },
  email:{
    type :"String",
    required:true,
    unique:true
  },
  password:{
    type:"String",
    required:true
  },
  profileURL:{
    type:"String",
    default:""
  },
  friends:{
    type:[{
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Friends"
      },
      userName:{
        type:"string",
        required:true
      },
      status:{
        type:Number,
      enum:[0, //friend req sent
        1,// pending frnd req
        2],// friends
        required:true
      }
    }]
  },
  refreshToken:{
    type:"String"
  }
},{timestamps:true})

userSchema.pre("save",async function(next){
  if (!this.isModified("password")) return next()
  this.password=await bcrypt.hash(this.password,10)
  next()
})

userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
  return  jwt.sign({id:this.id,userName:this.userName},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}

userSchema.methods.generateRefreshToken=function(){
  return  jwt.sign({id:this.id,userName:this.userName},process.env.REFRESH_SECRET,{expiresIn:process.env.REFRESH_EXPIRE})
}


export const User=mongoose.model('User',userSchema)
