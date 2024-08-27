class APIResponse{
  constructor(statusCode,message,data,success=true){
    this.statusCode=statusCode,
    this.message=message,
    this.data=data
    success
  }
}

export default APIResponse
