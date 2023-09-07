const { Schema, model } = require("mongoose");

// User Schema in DB
const userSchema = new Schema(
  {
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("UserModel", userSchema);
