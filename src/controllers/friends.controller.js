import mongoose from "mongoose";
import { User } from "../models/user.modle.js";
import APIError from "../utils/APIError.js";
import asyncHandler from "../utils/asyncHandler.js";
import APIResponse from "../utils/APIResponse.js";

const sendFriendRequest = asyncHandler(async (req, res) => {
  const {id}  = req;
  const { userId } = req.body;
  if(!userId) throw new APIError(400,"Required user id")
  const friend=await User.findOne({userName:userId})
  if(!friend) throw new APIError(404,"Invalid user id")
  const checkUserAlreadyFriendPipeline=[
  {
    '$match': {
      '$and': [
        {
          '_id': new mongoose.Types.ObjectId(id)
        }, {
          'friends': {
            '$elemMatch': {
              'userName': userId
            }
          }
        }
      ]
    }
  }
]
  const checkUserAlreadyFriend=await User.aggregate(checkUserAlreadyFriendPipeline)
  if(checkUserAlreadyFriend.length>0){
    throw new APIError(409,"Already friends or sentRequest")
  }
  const session=await mongoose.startSession()
  session.startTransaction()
  try{
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new APIError(404, "something went wrong");
    }
    user.friends.push({userId:friend._id,userName:friend.userName,status:0});
    friend.friends.push({userId:id,userName:user.userName,status:1});
    await user.save();
    await friend.save();
    await session.commitTransaction()
    res.status(200).json(new APIResponse(200, "Friend Request sent successfully"));
  }
  catch(err){
    console.log(err)
    session.abortTransaction()
    session.endSession()
    throw new APIError(500,err.message)
  }
});

const acceptFriendRequest=asyncHandler(async(req,res)=>{
  const id=req.id
  const {friendId}=req.body
  const user=await user.findOne({_id:id})
  if(!user) throw new APIError(404,"something wen wrong")
  const friend=await user.findOne({userName:friendId})
  if(!friend) throw new APIError(404,"Invalid userName")
  let reqPending=false
  let reqSent=false
  user.friends.map((friends)=>{
    friends.user===friend._id && friends.status===1 && (reqPending=true)
  })
  friend.friends.map((friends)=>{
    friends.user===user._id && friends.status===0 && (reqSent=true)
  })
  if(!reqPending&&!reqSent) throw new APIError(404,"something went wrong")
  user.friends.map((friends)=>{
    friends.user===friends._id &&(friends.status=2)
    return friends
  })
  friend.friends.map((friends)=>{
    friends.user===friends._id &&(friends.status=2)
    return friends
  })
  await user.save()
  await friend.save()
  res.status(200).json(new APIResponse(200,"friend request accepted successfully"))

});

const rejectFriendRequest=asyncHandler(async(req,res)=>{

});

const pendingFriendRequest=asyncHandler(async(req,res)=>{
  const pendingFriendsPipeline=[
  {
    '$match': {
      '_id': new mongoose.Types.ObjectId(req.id)
    }
  }, {
    '$unwind': '$friends'
  }, {
    '$match': {
      'friends.status': 1
    }
  }, {
    '$group': {
      '_id': '$_id', 
      'friends': {
        '$push': {
          userName: '$friends.userName',
          status: '$friends.status'
          }      
        }
    }
  },
      {
    '$project': {
      '_id': 0, 
      'friends':1
    }
  }
]
  const pendingFriends=await User.aggregate(pendingFriendsPipeline)
  return res.status(200).json(new APIResponse(200,"pending friends fetched successfully",pendingFriends[0]))
})

const getAllFriends=asyncHandler(async(userName)=>{
  const getAllFriendsStatusPipeline=[
  {
    $match: {
      userName: userName,
    },
  },
  {
    $unwind: "$friends", 
  },
  {
    $match: {
      "friends.status": 2,
    },
  },
  {
    $project: {
      _id: 0, 
      "userName": "$friends.userName",
      "profileURL": "$profileURL"
    },
  },
]
  const friends=await User.aggregate(getAllFriendsStatusPipeline)
  return friends
})

const searchFriends=asyncHandler(async(req,res)=>{
  const id=req.id
  const {search}=req.body
  const user=await User.findOne({_id:id})
  if(!user) throw new APIError(404,"something went wrong")
  const friends=user.friends.map((friend)=>{
    if (friend.userName.includes(search)) {return friend}
  })
  return res.status(200).json(new APIResponse(200,"friend status fetched successfully",{friends}))
})


export {sendFriendRequest,acceptFriendRequest,rejectFriendRequest,pendingFriendRequest,getAllFriends}
