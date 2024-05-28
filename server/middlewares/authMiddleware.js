const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    //get a token from header
    const token = req.header("authorization").split(" ")[1];
    const decryptToken = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decryptToken.userId;
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
