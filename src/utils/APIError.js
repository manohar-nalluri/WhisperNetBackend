class APIError extends Error{
  constructor(statusCode,message,data=null,success=false){
    super()
    this.statusCode=statusCode
    this.message=message
    data
    success
  }
}

export default APIError
