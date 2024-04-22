module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            req.flash('error', error.message); // Flash error message
            next(error);
        });
    };
};

/*
the fn returns a new function that the middleware function will use
fn is the actual fucntion containing the async code
the catch(next) catches any errors during the process and passes it 
to the next function which is the express error handling middleware
*/