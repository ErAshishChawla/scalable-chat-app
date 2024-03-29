import { Request, Response } from "express";

import { User } from "../../models/User";

import {
  signUpSchema,
  signupSchemaType,
} from "../../zod-schemas/signup-schema";

import { apiResponse } from "../../utils/api-response";
import {
  avatarKeyGenerator,
  getObjectURL,
  putObjectURL,
} from "../../utils/aws-s3";
import { sendEmail } from "../../utils/send-grid";
import { verificationEmailTemplate } from "../../email-templates/verification-email";

type RegisterRequest = Request<{}, {}, signupSchemaType>;

export const handleSignup = async (req: RegisterRequest, res: Response) => {
  try {
    // we get data from req.body
    const signupData = req.body;

    const result = await signUpSchema.safeParseAsync(signupData);

    // if result.success is false, we send an error response
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    // if result.success is true, we destructure the validated data
    const { email, password, firstName, lastName, profilePictureDetails } =
      result.data;

    // we can now use the validated data

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    // if the user already exists, we send an error response
    if (existingUser) {
      return res.status(400).json(apiResponse(400, "User already exists"));
    }

    // if the user does not exist, we continue with the signup process

    // Create an S3 bucket presigned URL
    let putAvatarUrl: string | null = null;

    if (profilePictureDetails) {
      // create a presigned URL
      // send the URL to the client
      const bucketKey = avatarKeyGenerator(email);
      putAvatarUrl = await putObjectURL(bucketKey, profilePictureDetails.type);
    }

    // if we have a putAvatarUrl, we can create a get url to store in db
    const avatarUrl = await getObjectURL(avatarKeyGenerator(email));

    // create a new user in the database. This automatically hashes the password, sends a verification email, and returns the user object
    const createdUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      avatar: avatarUrl,
    });

    const emailMessage = verificationEmailTemplate(
      createdUser.firstName,
      createdUser.lastName,
      createdUser.verificationToken!
    );

    sendEmail({
      to: createdUser.email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Please verify your email",
      html: emailMessage,
    });

    // send the s3 url to the client and success response
    return res
      .status(201)
      .json(apiResponse(201, "User created", { avatarUrl: putAvatarUrl }));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiResponse(500, "Internal server error"));
  }
};
