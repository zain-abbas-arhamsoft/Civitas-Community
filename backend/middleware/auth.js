const jwt = require("jsonwebtoken");
const byPassedRoutes = [
  "/api/users/get-adminuser-count",
  "/api/users/rewards-details",
  "/api/organizations/rewards-details-org",
  "/api/organizations/list",
];

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.send({ message: "No token provided", statusCode: 401 }); // Set the status code to 401
    }
    const { userId, isAdmin } = jwt.verify(token, process.env.TOKEN_KEY);
    if (!isAdmin && byPassedRoutes.indexOf(req.originalUrl) > -1) {
      return res.send({ message: "User is not authorized", statusCode: 403 });
    }
    req.body = {
      ...req.body,
      userId,
      isAdmin,
    };
    return next();
  } catch (err) {
    return res.send({
      statusCode: 401,
      success: false,
      error: err.message,
    });
  }
};


module.exports = { verifyToken };
