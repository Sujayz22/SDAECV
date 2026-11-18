import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Backend validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const emailSubject = `New Newsletter Subscription: ${email}`;

    const textContent = `
New Newsletter Subscription Request:
------------------------------------
Email: ${email}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #fafafa;">
        <h2 style="color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 10px; margin-top: 0;">
          New Newsletter Subscription
        </h2>
        <p style="color: #140d23; font-size: 16px; margin: 20px 0;">
          A user has requested to subscribe to the SDAECV Newsletter.
        </p>
        <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #ffb800; border-radius: 4px; font-size: 16px;">
          <strong>Subscriber Email:</strong> <a href="mailto:${email}" style="color: #004d40; text-decoration: none; font-weight: bold;">${email}</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0 20px 0;" />
        <p style="font-size: 11px; color: #999999; text-align: center; margin: 0;">
          Sent automatically from SDA English Church Vellore Website newsletter form.
        </p>
      </div>
    `;

    const result = await sendEmail({
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send subscription notification via SMTP.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error('Error in newsletter subscription endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
