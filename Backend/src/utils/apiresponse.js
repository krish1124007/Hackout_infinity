class ApiResponse{
    constructor(status , message , data)
    {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}


function returnRespones(res,status , message , data , sendcoookie,cookieItem)
{
    if(sendcoookie == true)
    {
        return res.status(status)
        .cookie("accessToken" , cookieItem)
        .json(
        new ApiResponse(status , message , data)
    )
    }
    return res.status(status)
    .json(
        new ApiResponse(status , message , data)
    )
}

export {returnRespones}