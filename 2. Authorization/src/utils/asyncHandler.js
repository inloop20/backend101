const asyncHandler = (fn)=> (req,res,next) =>{
    Promise.resolve(fn).catch(next);
    
    }
export default asyncHandler;