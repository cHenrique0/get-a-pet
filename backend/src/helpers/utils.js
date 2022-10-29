module.exports = {
  message: (msg, data) => {
    if (data) {
      return { msg: msg, data: { data } };
    }

    return { msg: msg };
  },
};
