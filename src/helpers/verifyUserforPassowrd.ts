import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import verifyUserEmail from "../../emails/verifyUserforPassword";

export async function verifyUserforPassword(
  email: string,
  username: string,
  token: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "lohar.dhruv07@gmail.com",
      to: email,
      subject: "MysterQ | Change Password",
      react: verifyUserEmail({ username, token: token }),
    });
    return { success: true, message: "Verification Email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verfication email", emailError);
    return { success: false, message: "Failed to send verfication email" };
  }
}
