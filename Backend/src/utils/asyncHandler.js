function asyncHandler(fn) {

    return async (req, res, next) => {
        return Promise.resolve(fn(req, res)).catch((err) => next(err))
    }

}


export { asyncHandler }