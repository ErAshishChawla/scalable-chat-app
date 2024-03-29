export const toastMessages = {
  emailVerificationSuccess(message?: string) {
    return `${
      message || "Email verified successfully."
    } Redirecting to login page...`;
  },

  emailVerificationError(message?: string) {
    return `${
      message || "Something went wrong. Please try again later."
    } Redirecting to login page...`;
  },
  loginSuccess(message?: string) {
    return message || "Login successful.";
  },
  loginError(message?: string) {
    return message || "Something went wrong. Please try again later.";
  },
};
