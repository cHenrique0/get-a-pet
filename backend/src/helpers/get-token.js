const getToken = (req) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  return token;
};

module.exports = getToken;
