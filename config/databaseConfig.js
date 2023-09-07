const mongoose = require("mongoose");

// Database connection
module.exports.connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const isConntected = (await mongoose.connection.readyState) === 1;
    if (isConntected) {
      console.log(
        `MongoDB Database is connected Successfully and Database connection is active on :  ${con.connection.host}`
      );
    } else {
      console.log("Database connection is not active");
    }
  } catch (err) {
    process.exit(1);
  }
};
