import React from "react";
import { AxiosError } from "axios";

import EmailVerification from "./_components/email-verification";

import { toastMessages } from "../../../helpers/toast-messages";
import { apiInstance } from "../../../lib/api-instance";

interface VerifyEmailPageProps {
  searchParams: {
    token: string;
  };
}

async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const token = searchParams.token;

  let content: React.ReactNode = null;

  if (!token) {
    content = (
      <EmailVerification
        message={toastMessages.emailVerificationError("Invalid token")}
        isError
      />
    );
  } else {
    try {
      const response = await apiInstance.get(
        `/auth/verify-email?verificationToken=${token}`
      );

      content = (
        <EmailVerification
          message={toastMessages.emailVerificationSuccess(
            response.data?.data?.message
          )}
          isError={false}
        />
      );
    } catch (error) {
      let message = toastMessages.emailVerificationError();

      if (error instanceof AxiosError) {
        message = toastMessages.emailVerificationError(
          error.response?.data.message
        );
      }

      content = <EmailVerification message={message} isError />;
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      {content}
    </div>
  );
}

export default VerifyEmailPage;
