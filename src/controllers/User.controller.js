import User from "../models/user.models.js";
import { AsyncHandler } from "../services/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";

// GENERATE TOKENS

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// REGISTER

const userRegister = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((feilds) => feilds?.trim() === "")) {
    throw new ApiError(400, "All feilds are required");
  }

  const userexisted = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userexisted) {
    throw new ApiError(400, "User is already exist.");
  }

  // DATABASE ENTERY

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password  -email -createdAt -updatedAt -__v"
  );

  return res
    .status(200)
    .json(new Apiresponse(200, createdUser, "User registered succesfully!"));
});

// LOGIN

const loginUser = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -password  -email -createdAt -updatedAt -__v"
  );

  const options = {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json(
      new Apiresponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged In Successfully"
      )
    );
});

// LOGOUT

const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(new Apiresponse(200, {}, "User logged Out"));
});

export { userRegister, loginUser, logoutUser };
