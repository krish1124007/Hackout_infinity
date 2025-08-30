import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya "hotmail", "yahoo", custom SMTP bhi de sakte ho
      auth: {
        user: process.env.EMAIL_USER, // e.g. your@gmail.com
        pass: process.env.EMAIL_PASS, // app password (not your main password!)
      },
    });

    // 2️⃣ Mail options
    const mailOptions = {
      from: `"Krish App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,  // plain text
      html,  // rich HTML
    };

    // 3️⃣ Send mail
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Mail sent:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Mail error:", error.message);
    return { success: false, error: error.message };
  }
};
