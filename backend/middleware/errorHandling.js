const routeNotFound = (req, res, next) => {
    const error = new Error('These are not the routes you are looking for');
    res.status(404);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    let statusCode;
    if (res.statusCode === 200)
        statusCode = 500;
    else
        statusCode = res.statusCode;   

    res.status(statusCode);

    let stack;
    if (process.env.NODE_ENV === 'production')
        stack = '🍕';
    else
        stack = error.stack;

    res.json({
        message: error.message,
        stack
    });
};

module.exports = {
    routeNotFound,
    errorHandler,
};