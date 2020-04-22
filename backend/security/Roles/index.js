const {
    ServerError
} = require('../../errors');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (req.params.id === req.state.decoded.userId) {
            return next();
        }
        for (let i = 0; i < roles.length; i++) {
            if (req.state.decoded.userRole === roles[i]) {
                return next();
            }
        }
        throw new ServerError('You do not have access at this resource!', 401);
    }
};

module.exports = {
    authorizeRoles
}