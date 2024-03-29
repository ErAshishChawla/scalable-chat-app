import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { JwtSafeParse } from "../../types/jwt-safe-parse";

import "dotenv/config";

export const generateResetToken = () => {
  return {
    resetToken: uuid(),
    resetTokenExpiry: DateTime.utc().plus({ hours: 1 }).toJSDate(),
  };
};

export const generateVerificationToken = () => {
  const verificationToken = uuid();
  const verificationTokenExpiry = DateTime.utc()
    .plus({ hours: Number(process.env.VERIFICATION_EXPIRY) || 24 })
    .toJSDate();

  return { verificationToken, verificationTokenExpiry };
};

export const verifyAccessTokenSafe = (accessToken: string): JwtSafeParse => {
  try {
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET!
    );

    return {
      success: true,
      isExpired: false,
      isInvalid: false,
      payload: payload,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        success: false,
        isExpired: true,
        isInvalid: false,
        payload: null,
      };
    }

    if (error instanceof JsonWebTokenError) {
      return {
        success: false,
        isExpired: false,
        isInvalid: true,
        payload: null,
      };
    }

    return {
      success: false,
      isExpired: false,
      isInvalid: false,
      payload: null,
    };
  }
};

export const verifyRefreshTokenSafe = (refreshToken: string): JwtSafeParse => {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!
    );

    return {
      success: true,
      isExpired: false,
      isInvalid: false,
      payload: payload,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        success: false,
        isExpired: true,
        isInvalid: false,
        payload: null,
      };
    }

    return {
      success: false,
      isExpired: false,
      isInvalid: true,
      payload: null,
    };
  }
};
