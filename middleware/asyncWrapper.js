function asyncWrapper(routeHandler) {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = asyncWrapper;
