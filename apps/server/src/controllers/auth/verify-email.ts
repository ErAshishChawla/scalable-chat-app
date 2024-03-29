import { Request, Response } from "express";
import { DateTime } from "luxon";

import { User } from "../../models/User";

import { apiResponse } from "../../utils/api-response";
import { sendEmail } from "../../utils/send-grid";
import { verificationEmailTemplate } from "../../email-templates/verification-email";
import { generateVerificationToken } from "../../utils/user-methods";

interface VerifyEmailRequest extends Request {
  query: {
    verificationToken: string;
  };
}

export const handleVerifyEmail = async (
  req: VerifyEmailRequest,
  res: Response
) => {
  try {
    const { verificationToken } = req.query;

    // if there is no verification token, we send an error response
    if (!verificationToken) {
      return res
        .status(400)
        .json(apiResponse(400, "No verification token provided"));
    }

    // find the user with the verification token
    const user = await User.findOne({ verificationToken });

    // if the user does not exist, we send an error response
    if (!user || !user.verificationToken || !user.verificationTokenExpiry) {
      return res
        .status(400)
        .json(apiResponse(400, "Invalid verification token"));
    }

    // covers the case when user has a verification token but it is already verified. if user is already verified, we send an error response
    if (user.isVerified) {
      return res.status(400).json(apiResponse(400, "User is already verified"));
    }

    // if user exists but the time is crossed the expiry time, we send an error response
    if (DateTime.utc() > DateTime.fromJSDate(user.verificationTokenExpiry)) {
      const { verificationToken, verificationTokenExpiry } =
        generateVerificationToken();

      await User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          verificationToken,
          verificationTokenExpiry,
        }
      );

      const verificationMessage = verificationEmailTemplate(
        user.firstName,
        user.lastName,
        verificationToken
      );

      sendEmail({
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Please verify your email",
        html: verificationMessage,
      });

      return res
        .status(400)
        .json(
          apiResponse(
            400,
            "Verification token has expired. A new token has been sent to your email address. Please verify with the new token."
          )
        );
    }

    // if everything is fine, we update the user's verification status to true
    await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      }
    );

    // send a success response
    return res
      .status(200)
      .json(apiResponse(200, "Email verified successfully"));
  } catch (error) {
    console.error("Error verifying email: ", error);
    return res.status(500).json(apiResponse(500, "Internal server error"));
  }
};
