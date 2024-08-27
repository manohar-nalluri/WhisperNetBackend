import  jwt from "jsonwebtoken";

export const socketMiddleware=(socket,next)=>{
  try{
  const token = socket.handshake.auth.token.split(' ')[1];
  if (!token) {
    return next(new Error("token not sent"));
  }
  jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
    if(err){
      throw next(new Error("invalid token"))
    }else{
      socket.userName=user.userName
      socket.id=user.id
      next()
    }
  })}catch(err){
    console.log('error')
  }
}
