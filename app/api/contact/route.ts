import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message, privacy } = body;

    // Simple backend validation
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing: name, email, topic, and message are required.' },
        { status: 400 }
      );
    }

    const isPrayer = type === 'prayer';
    const isPrivate = Boolean(privacy);

    const topicLabel =
      {
        prayer: 'Prayer Request',
        visit: 'Planning a Visit',
        membership: 'Membership Info',
        volunteer: 'Volunteer / Serve',
        general: 'General Inquiry',
      }[type as string] || type;

    const privacyTag = isPrivate ? ' [CONFIDENTIAL / PRIVATE]' : '';
    const emailSubject = `New Connect Form Submission: [${topicLabel}] from ${name}${privacyTag}`;

    const textContent = `
New Connect Form Submission received:
------------------------------------
Topic: ${topicLabel}
Confidentiality: ${isPrivate ? 'YES — PRIVATE (Share only with pastoral staff)' : 'Standard (Not marked private)'}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

${isPrayer ? 'Prayer Request' : 'Message'}:
${message}
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #fafafa;">
        <h2 style="color: #5b2d9c; border-bottom: 2px solid #5b2d9c; padding-bottom: 10px; margin-top: 0;">
          New Connect Form Submission
        </h2>
        
        ${isPrivate ? `
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0; color: #991b1b; font-size: 13px; font-weight: bold;">
            🔒 CONFIDENTIAL: The sender marked this request as PRIVATE (share only with pastoral staff).
          </p>
        </div>
        ` : ''}

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #7a6d8e; text-transform: uppercase; font-size: 11px;">Topic</td>
            <td style="padding: 8px 0; font-weight: bold; color: #e36520;">${topicLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #7a6d8e; text-transform: uppercase; font-size: 11px;">Confidentiality</td>
            <td style="padding: 8px 0; font-weight: bold;">
              ${isPrivate 
                ? '<span style="background-color: #fee2e2; color: #b91c1c; padding: 3px 8px; border-radius: 4px; font-size: 11px; display: inline-block;">🔒 PRIVATE — Pastoral Staff Only</span>' 
                : '<span style="color: #6b7280; font-size: 12px;">Standard (Not marked private)</span>'}
            </td>
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
          <p style="margin: 0; font-weight: bold; color: #7a6d8e; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">
            ${isPrayer ? 'Prayer Request' : 'Message / Details'}
          </p>
          <p style="margin: 0; color: #140d23; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0 20px 0;" />
        <p style="font-size: 11px; color: #999999; text-align: center; margin: 0;">
          Sent automatically from SDA English Church Vellore Website connect form.
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
