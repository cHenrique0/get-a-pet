require("dotenv").config();
const mongoose = require("mongoose");

const main = async () => {
  await mongoose.connect(process.env.DB_URI);
};

main()
  .then(() => {
    console.log("* Database successfully connected");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = mongoose;
