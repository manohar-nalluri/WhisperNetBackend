import { io } from "../app.js";
import { getAllFriends } from "../controllers/friends.controller.js";

const users={}
export const socketConnection=()=>{
io.on("connection",(socket)=>{
  users[socket.userName]=socket
  handleNewUserConnected(socket)
  socket.on('firstTimeConnected',()=>handleFirstTimeConnected(socket))
  socket.on('disconnect',()=>handleDisconnect(socket))
  socket.on('offer',({peer,offer})=>handleOffer(socket,peer,offer))
  socket.on('answer',({peer,answer})=>handleAnswer(socket,peer,answer))
})
}

const handleAnswer=(socket,peer,answer)=>{
  if(users[peer]){
    users[peer].emit('answer',{peer:socket.userName,answer})
  }
}

const handleOffer=(socket,peer,offer)=>{
  console.log('came here')
  if(users[peer]){
    console.log(users[peer].userName,'in sending')
    users[peer].emit('offer',{peer:socket.userName,offer})
  }
}

const handleNewUserConnected=async(socket)=>{
  const friends=await getAllFriends(socket.userName)
  friends.map((friend)=>{
    if(users[friend.userName]){
      users[friend.userName].emit('connectionChange',socket.userName,true)
    }
  })
}

const handleDisconnect=async(socket)=>{
  const friends=await getAllFriends(socket.userName)
  for (let friend of friends){
    if(users[friend.userName]){
      console.log(friend.userName)
      users[friend.userName].emit('connectionChange',socket.userName,false)
    }
  }
  delete users[socket.userName]
}

const handleFirstTimeConnected=async(socket)=>{
  const friends=await getAllFriends(socket.userName)
  for (let friend of friends){
    if(!users[friend.userName]){
      friend.online=false
    }else{
    friend.online=true
    }
  }
    console.log(friends)
  socket.emit('friends',friends)
}
