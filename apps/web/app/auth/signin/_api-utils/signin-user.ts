import { loginSchemaType } from "../../../../zod-schemas/signin-schema";
import { apiInstance } from "../../../../lib/api-instance";

export const signinUser = async (data: loginSchemaType) => {
  return apiInstance.post("/auth/signin", data);
};
