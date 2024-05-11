import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jsonwebTokens from "jsonwebtoken";
import { configuration } from "../config/config.js";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// METHODS IN SCHEMA

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jsonwebTokens.sign(
    {
      _id: this._id,
      emial: this.email,
      username: this.username,
    },
    configuration.ACCESS_TOKEN_SECRET,
    { expiresIn: configuration.ACCESS_TOKEN_EXPIRY }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jsonwebTokens.sign(
    {
      _id: this._id,
    },
    configuration.REFRESH_TOKEN_SECRET,
    { expiresIn: configuration.REFRESH_TOKEN_EXPIRY }
  );
};

export default model("User", userSchema);
