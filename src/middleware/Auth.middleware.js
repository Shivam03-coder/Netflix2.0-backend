import JWT from "jsonwebtoken";
import { AsyncHandler } from "../services/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { configuration } from "../config/config.js";
import User from "../models/user.models.js";

export const JWTVerification = AsyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unautorized error");
    }

    const decodedtoken = JWT.verify(token, configuration.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshtoken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid user error");
    }
    req.user = user;
    next();
      } catch (error) {
    throw new ApiError(401, "Invalid user error");
  }
});
