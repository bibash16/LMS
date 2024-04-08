const leave=require('./../models/leaveform');


exports.leaveSchema=async(req,res,next)=> {
    try{
        const leavereq = await leaveSchema.create(req.body);

        req.status(201).json({
            status:'success',
            data:{
                leaveSchema:leavereq
            }
        });

    }catch(err){
        res.status(404).json({
        status:'Fail',
        message:err
    });
    }
};