export const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    logger.error(`${err.message} - ${req.method} ${req.url}`);
    res.status(500).json({message: 'Internal Server Error'})
}