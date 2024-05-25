//to make sure that we catch all the errors that are thrown in the async functions
//and prevent the server from crashing we will create a middleware
//this middleware will catch all the errors that are thrown in the async functions
//and pass them to the error handler middleware

export const catchAsyncError = (fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch(next);

    };

};