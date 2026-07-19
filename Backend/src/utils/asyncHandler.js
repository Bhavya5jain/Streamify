const asyncHandler = (RequestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(RequestHandler(req, res, next))
            .catch((error) => {
                console.error("[asyncHandler error]", error?.message, error?.stack);
                // If response already sent, pass to Express error handler
                if (res.headersSent) return next(error);
                const statusCode = error?.statusCode || 500;
                res.status(statusCode).json({
                    success: false,
                    message: error?.message || "Internal Server Error",
                    errors: error?.errors || [],
                });
            });
    };
};

export { asyncHandler };
