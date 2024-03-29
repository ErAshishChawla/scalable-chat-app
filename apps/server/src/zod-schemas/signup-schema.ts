import { z } from "zod";
import {
  noSpacesRegex,
  oneLowercaseLetterRegex,
  oneNumberRegex,
  oneSpecialCharacterRegex,
  oneUppercaseLetterRegex,
  onlyAlphabetsRegex,
} from "./regex";

const MAX_FILE_SIZE =
  Number(process.env.MAX_PROFILE_IMAGE_SIZE) || 1024 * 1024 * 2;

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(noSpacesRegex, "Password must not contain spaces")
    .regex(
      oneLowercaseLetterRegex,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      oneUppercaseLetterRegex,
      "Password must contain at least one uppercase letter"
    )
    .regex(oneNumberRegex, "Password must contain at least one number")
    .regex(
      oneSpecialCharacterRegex,
      "Password must contain at least one special character"
    ),

  firstName: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "First name is required")
    .regex(onlyAlphabetsRegex, "First name must contain only alphabets"),

  lastName: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "First name is required")
    .regex(onlyAlphabetsRegex, "Last name must contain only alphabets"),

  profilePictureDetails: z
    .object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
    })
    .refine((data) => data.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / 2}MB`,
    })
    .refine((data) => data.type.startsWith("image"), {
      message: "File must be an image",
    })
    .optional(),
});

export type signupSchemaType = z.infer<typeof signUpSchema>;
