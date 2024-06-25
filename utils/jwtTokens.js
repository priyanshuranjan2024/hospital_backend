export const generateAccessToken = (user, message, statuscode, res) => {
  const token = user.generateToken();
  //if can have two types of token one if the role is admin other if the role is user
  const cookieName = user.role === "admin" ? "adminToken" : "userToken";
  res
    .status(statuscode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
