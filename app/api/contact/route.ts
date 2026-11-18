import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message } = body;

    // Simple backend validation
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing: name, email, topic, and message are required.' },
        { status: 400 }
      );
    }

    const topicLabel =
      {
        prayer: 'Prayer Request',
        visit: 'Planning a Visit',
        membership: 'Membership Info',
        volunteer: 'Volunteer / Serve',
        general: 'General Inquiry',
      }[type as string] || type;

    const emailSubject = `New Connect Form Submission: [${topicLabel}] from ${name}`;

    const textContent = `
New Connect Form Submission received:
------------------------------------
Topic: ${topicLabel}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #fafafa;">
        <h2 style="color: #5b2d9c; border-bottom: 2px solid #5b2d9c; padding-bottom: 10px; margin-top: 0;">
          New Connect Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #7a6d8e; text-transform: uppercase; font-size: 11px;">Topic</td>
            <td style="padding: 8px 0; font-weight: bold; color: #e36520;">${topicLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #7a6d8e; text-transform: uppercase; font-size: 11px;">Name</td>
            <td style="padding: 8px 0; color: #140d23;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #7a6d8e; text-transform: uppercase; font-size: 11px;">Email</td>
            <td style="padding: 8px 0; color: #140d23;"><a href="mailto:${email}" style="color: #5b2d9c; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #7a6d8e; text-transform: uppercase; font-size: 11px;">Phone</td>
            <td style="padding: 8px 0; color: #140d23;">${phone || '<i>Not provided</i>'}</td>
          </tr>
        </table>
        <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #e36520; border-radius: 4px; margin-top: 20px;">
          <p style="margin: 0; font-weight: bold; color: #7a6d8e; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">Message / Prayer Request</p>
          <p style="margin: 0; color: #140d23; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0 20px 0;" />
        <p style="font-size: 11px; color: #999999; text-align: center; margin: 0;">
          Sent automatically from SDA English Church Vellore Website contact form.
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
        { success: false, error: result.error || 'Failed to send email message via SMTP.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error('Error in contact form submission endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
