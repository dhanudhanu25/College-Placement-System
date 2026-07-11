// ============================================================
// JWT Helper
// Issues a signed token, sets it as an httpOnly cookie and
// returns the token in the response body.
// ============================================================

const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res, message = "Success") => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  const options = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // Remove password from output
  const userData = user.toObject ? user.toObject() : user;
  delete userData.password;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      user: userData,
    });
};

module.exports = sendToken;
