import "dotenv/config";

export const verificationEmailTemplate = (
  firstName: string,
  lastName: string,
  verificationToken: string
) => {
  return `
        <html>
        <body>
            <h1>Hi ${firstName} ${lastName},</h1>
            <p>Welcome to the platform! Please verify your email by clicking the link below:</p>
            <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}">Verify Email</a>
        </body>
        </html>
    `;
};
