export const EMAIL_VERIFY_MESSAGES = {
  success: [
    "Account Setup Complete",
    "Your email address has been successfully verified. Please sign in to start using Unblock Health",
  ],
  used: [
    "Email Verification",
    "Your email address has been successfully verified and is now ready for use. Please sign in to begin using Unblock Health.",
  ],
  expired: [
    "Email Verification",
    "The request cannot be processed as the link has expired",
  ],
  invalid_token: [
    "Email Verification",
    "The request cannot be processed as the link provided is invalid",
  ],
  error: [
    "Unexpected Error",
    "An unexpected error has occurred. Kindly try again later or feel free to reach out to our support team at " +
    import.meta.env.VITE_SUPPORT_MAIL_ADDRESS,
  ],
};
