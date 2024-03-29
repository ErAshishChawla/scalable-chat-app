import { apiInstance } from "../../../../lib/api-instance";
import { signupSchemaType } from "../../../../zod-schemas/signup-schema";

export const registerUser = async (data: signupSchemaType) => {
  const response = await apiInstance.post("/auth/signup", {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    profilePictureDetails: data.profilePictureDetails,
  });
  return response;
};
