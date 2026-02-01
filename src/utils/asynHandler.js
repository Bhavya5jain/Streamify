const asyncHandler = (RequestHandler) => {
    (req,res,next)=>{
        Promise
        .resolve(RequestHandler(req,res,nect))
        .reject((error)=>{console.log(error.message)})
    }
}

export {asyncHandler};

// Samajhne ke liye

// const asyncHandler = (fn) => async () => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }