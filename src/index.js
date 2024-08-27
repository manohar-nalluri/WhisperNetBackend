import dotenv from "dotenv"
import connectDB from "./db/index.js"
import  { server } from "./app.js"

dotenv.config({
  path:".env"
})

connectDB()
.then(
    server.listen(process.env.PORT || 8001,()=>{
      console.log('server stared on port',process.env.PORT || 8001)
    })
  )
.catch((err)=>{
    console.log('error while starting the server',err)
  })
