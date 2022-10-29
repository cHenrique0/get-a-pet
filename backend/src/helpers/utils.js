module.exports = {
  message: (msg, data) => {
    if (data) {
      if (data.length > 1) {
        return { msg: msg, token, data: { newUser: data } };
      }
      return { msg: msg, data: { newUser: data } };
    }

    return { msg: msg };
  },
};
