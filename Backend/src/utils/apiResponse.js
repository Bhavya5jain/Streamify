class apiResponse{
    constructor(statusCode=200,message="Success",data){
        this.message=message
        this.statusCode=statusCode;
        this.data=data;
        this.success=true
    }
}

export {apiResponse};