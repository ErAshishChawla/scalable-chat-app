import { Request, Response } from "express";

import { User } from "../../models/User";

import { loginSchema } from "../../zod-schemas/signin-schema";
import { apiResponse } from "../../utils/api-response";

interface SigninRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const handleSignin = async (req: SigninRequest, res: Response) => {
  try {
    console.log("Signin request");
    // extract email and password from req.body
    const { email, password } = req.body;

    // validate email and password
    const result = await loginSchema.safeParseAsync({ email, password });

    if (!result.success) {
      return res.status(400).json(apiResponse(400, result.error.message));
    }

    // check if user exists in database
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json(apiResponse(400, "Invalid email or password"));
    }

    // check if password matches
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json(apiResponse(400, "Invalid email or password"));
    }

    // check if user is verified
    if (!user.isVerified) {
      return res.status(400).json(apiResponse(400, "Please verify your email"));
    }

    // generate access token and refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // store refresh token in database
    await User.findByIdAndUpdate(user._id, { refreshToken });

    const updatedUser = await User.findById(user._id);

    // clear the cookies
    res.clearCookie("chatapp-access-token");
    res.clearCookie("chatapp-refresh-token");

    // set the token in cookie
    res.cookie("chatapp-access-token", accessToken, {
      httpOnly: true,
    });
    res.cookie("chatapp-refresh-token", refreshToken, {
      httpOnly: true,
    });

    // send the response
    return res.status(200).json(apiResponse(200, "Login successful"));
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json(apiResponse(500, "Internal server error"));
  }
};
