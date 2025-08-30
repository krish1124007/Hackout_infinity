import { inngest } from "../client.js";
import { sendMail } from "../../utils/sendmail.js";
import { generateOTP } from "../../utils/generateotp.js";
import { NonRetriableError } from "inngest"
import { text } from "express";


export const onDelete = inngest.createFunction(
  { id: "on-delete", retries: 2 },
  { event: "user/delete" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;   
      console.log("📨 Sending to:", email);

      const otp = await step.run("generate-otp", async () => {
        const otp = generateOTP();
        if (!otp) {
          throw new NonRetriableError("OTP is not generated");
        }
        return otp;
      });

      await step.run("send-del-mail", async () => {
        const subject = "Delete Confirmation";
        const text = `Your OTP is: ${otp}`;
        const html = `<p>Your OTP is: <b>${otp}</b></p>`;

        const result = await sendMail({
          to: email,
          subject,
          text,
          html
        });

        console.log("📧 Mail send result:", result);
      });

      return { success: true };
    } catch (error) {
      console.log("❌ Error running step", error.message);
      return { success: false };
    }
  }
);

