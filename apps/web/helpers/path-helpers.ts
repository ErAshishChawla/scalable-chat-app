export const paths = {
  home() {
    return "/";
  },
  signin() {
    return "/auth/signin";
  },
  signup() {
    return "/auth/signup";
  },
  verifyEmail() {
    return "/auth/verify-email";
  },
  app() {
    return "/chat-app";
  },

  publicPaths() {
    return [this.home(), this.verifyEmail()];
  },

  authPaths() {
    return [this.signin(), this.signup()];
  },

  protectedPaths() {
    return [this.app()];
  },
};
