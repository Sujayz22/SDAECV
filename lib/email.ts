import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_TO_EMAIL = process.env.SMTP_TO_EMAIL;

export async function sendEmail({
  subject,
  text,
  html,
}: {
  subject: string;
  text: string;
  html: string;
}) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_TO_EMAIL) {
    console.warn('SMTP configuration is missing. Email not sent. Please verify SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_TO_EMAIL in your environment variables.');
    return { success: false, error: 'SMTP configuration is missing' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${subject}" <${SMTP_USER}>`,
      to: SMTP_TO_EMAIL,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message || 'SMTP error' };
  }
}
