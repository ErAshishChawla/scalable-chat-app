import { Request, Response } from "express";

import { apiResponse } from "../../utils/api-response";
import {
  verifyAccessTokenSafe,
  verifyRefreshTokenSafe,
} from "../../utils/user-methods";
import { User } from "../../models/User";

export const refreshAccessToken = async (req: Request, res: Response) => {
  console.log("refreshAccessToken");
  try {
    const incomingRefreshToken = req.cookies["chatapp-refresh-token"];

    if (!incomingRefreshToken) {
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // verify refresh token
    const { success, isInvalid, isExpired, payload } =
      verifyRefreshTokenSafe(incomingRefreshToken);

    // if refresh token invalid, return 401, clear cookies
    if (isInvalid) {
      res.clearCookie("chatapp-access-token");
      res.clearCookie("chatapp-refresh-token");
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // if refresh token expired, return 401, clear cookies
    if (isExpired) {
      res.clearCookie("chatapp-access-token");
      res.clearCookie("chatapp-refresh-token");
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // if refresh token valid, we check if user has same id as refresh token and does refresh token match the one in the database
    const _id: string = payload?._id;

    // if no id, return 401, clear cookies
    if (!_id) {
      res.clearCookie("chatapp-access-token");
      res.clearCookie("chatapp-refresh-token");
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // if id, check if user exists
    const user = await User.findOne({
      _id,
      refreshToken: incomingRefreshToken,
    });
    // console.log(user?.refreshToken === incomingRefreshToken);
    // console.log(user?.refreshToken, incomingRefreshToken);

    // if user not found, return 401, clear cookies
    if (!user) {
      res.clearCookie("chatapp-access-token");
      res.clearCookie("chatapp-refresh-token");
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // if user exists, generate new access and refresh tokens and send them in response
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // update the refresh token in the database
    await User.findByIdAndUpdate(_id, { refreshToken: newRefreshToken });

    // get data from new access token
    const { payload: newPayload } = verifyAccessTokenSafe(newAccessToken);

    // clear out previous cookies
    res.clearCookie("chatapp-access-token");
    res.clearCookie("chatapp-refresh-token");

    // set new cookies
    res.cookie("chatapp-access-token", newAccessToken, {
      httpOnly: true,
    });
    res.cookie("chatapp-refresh-token", newRefreshToken, {
      httpOnly: true,
    });

    // send response
    return res.status(200).json(apiResponse(200, "Authorized", newPayload));
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiResponse(500, "Internal Server Error"));
  }
};
