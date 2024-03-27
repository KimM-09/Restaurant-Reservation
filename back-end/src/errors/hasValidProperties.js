function hasValidProperties(...properties) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        next();
    }
}

module.exports = hasValidProperties;