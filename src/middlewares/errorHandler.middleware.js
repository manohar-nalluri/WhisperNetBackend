import APIError from "../utils/APIError.js";
const errorhandler=(err,_,res,next)=>{
  if (err instanceof APIError) {
    res.status(err.statusCode).json(err);
  } else {
    console.log(err)
    res.status(500).json(new APIError(500,err.message));
  }}

export default errorhandler

