import { Request, Response, NextFunction } from "express";

import { apiResponse } from "../../utils/api-response";
import { verifyAccessTokenSafe } from "../../utils/user-methods";
import { refreshAccessToken } from "./refresh-access-token";

export const checkAuth = (req: Request, res: Response) => {
  console.log("checkAuth");
  try {
    const accessToken = req.cookies["chatapp-access-token"];
    const refreshToken = req.cookies["chatapp-refresh-token"];

    if (!accessToken || !refreshToken) {
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // verify access token
    const {
      success: accessTokenSuccess,
      isExpired: isAccessTokenExpired,
      isInvalid: isAccessTokenInvalid,
      payload: accessTokenPayload,
    } = verifyAccessTokenSafe(accessToken);

    // console.log("accessTokenSuccess", accessTokenSuccess);
    // console.log("isAccessTokenExpired", isAccessTokenExpired);
    // console.log("isAccessTokenInvalid", isAccessTokenInvalid);
    // console.log("accessTokenPayload", accessTokenPayload);

    // if invalid, return 401, clear cookies
    if (isAccessTokenInvalid) {
      res.clearCookie("chatapp-access-token");
      res.clearCookie("chatapp-refresh-token");
      return res.status(401).json(apiResponse(401, "Unauthorized"));
    }

    // if expired, verify refresh token
    if (isAccessTokenExpired) {
      return refreshAccessToken(req, res);
    }

    return res
      .status(200)
      .json(apiResponse(200, "Authorized", accessTokenPayload));
  } catch (error) {
    console.log(error);
    return res.status(500).json(apiResponse(500, "Internal Server Error"));
  }
};
