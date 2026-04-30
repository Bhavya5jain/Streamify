const asyncHandler = (RequestHandler) => {
    return (req,res,next)=>{
        Promise
        .resolve(RequestHandler(req,res,next))
        .catch((error)=>{console.log(error.message)})
    }
}

export {asyncHandler};

// Samajhne ke liye

// const asyncHandler = (fn) => async (req,res) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

// export {asyncHandler};