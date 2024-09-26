import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verficationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "lohar.dhruv07@gmail.com",
      to: email,
      subject: "MysterQ | Verification Code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "Verification Email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verfication email", emailError);
    return { success: false, message: "Failed to send verfication email" };
  }
}
