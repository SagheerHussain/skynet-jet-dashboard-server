const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Db Connection successfully");
  } catch (error) {
    console.log("error mongo db connection == >", error);
  }
};

module.exports = {
  dbConnection
};
