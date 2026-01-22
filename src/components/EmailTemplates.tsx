// Email templates for FIND platform
// These can be used with email services like SendGrid, Mailgun, or Supabase email

export const confirmEmailTemplate = (confirmationUrl: string, userEmail: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your FIND Account</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          min-height: 100vh;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .content p {
          color: #4b5563;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .confirmation-section {
          background: #f3f4f6;
          border-left: 4px solid #dc2626;
          padding: 20px;
          margin: 30px 0;
          border-radius: 8px;
        }
        .confirmation-section p {
          margin-bottom: 12px;
          font-weight: 500;
          color: #1f2937;
        }
        .confirmation-button {
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }
        .confirmation-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
        }
        .url-section {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          word-break: break-all;
        }
        .url-section p {
          font-size: 12px;
          color: #92400e;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .url-section a {
          color: #dc2626;
          text-decoration: none;
          font-size: 13px;
          word-break: break-all;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .footer a {
          color: #dc2626;
          text-decoration: none;
        }
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 30px 0;
        }
        .feature {
          text-align: center;
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .feature-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .feature-title {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .feature-text {
          font-size: 12px;
          color: #6b7280;
        }
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🎯 Welcome to FIND</h1>
          <p>Your Career and Lifestyle Platform</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>Confirm your signup</h2>
          
          <p>Hi there! 👋</p>
          
          <p>Thanks for registering with FIND. We're excited to have you on board! To get started and unlock all the features, please confirm your email address.</p>

          <div class="confirmation-section">
            <p>✉️ Email Address</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">${userEmail}</p>
          </div>

          <p>Click the button below to confirm your email:</p>

          <div style="text-align: center;">
            <a href="${confirmationUrl}" class="confirmation-button">
              ✓ Confirm your email
            </a>
          </div>

          <p style="text-align: center; font-size: 14px; color: #6b7280;">
            Or copy and paste this link in your browser:
          </p>

          <div class="url-section">
            <p>Verification Link:</p>
            <a href="${confirmationUrl}" target="_blank">${confirmationUrl}</a>
          </div>

          <div class="divider"></div>

          <p>Once confirmed, you'll have access to:</p>

          <div class="features">
            <div class="feature">
              <div class="feature-icon">💼</div>
              <div class="feature-title">Job Board</div>
              <div class="feature-text">Find exciting opportunities</div>
            </div>
            <div class="feature">
              <div class="feature-icon">🤝</div>
              <div class="feature-title">Roommates</div>
              <div class="feature-text">Connect with others</div>
            </div>
            <div class="feature">
              <div class="feature-icon">🚕</div>
              <div class="feature-title">Taxi Booking</div>
              <div class="feature-text">Easy transport</div>
            </div>
            <div class="feature">
              <div class="feature-icon">👤</div>
              <div class="feature-title">Profile</div>
              <div class="feature-text">Build your profile</div>
            </div>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            <strong>⚠️ Security Note:</strong> If you didn't create this account, please ignore this email or contact our support team.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>This link will expire in 24 hours for security reasons.</p>
          <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            © 2026 FIND. All rights reserved.<br>
            <a href="https://find-platform.com">Visit our website</a>
          </p>
          <p style="margin-top: 10px; font-size: 11px;">
            Have questions? <a href="mailto:support@find.com">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const jobApplicationEmailTemplate = (
  applicantName: string,
  jobTitle: string,
  companyName: string,
  applicantEmail: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Application - ${jobTitle}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #1f2937;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .content p {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .application-card {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 1px solid #e5e7eb;
          border-left: 4px solid #dc2626;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .application-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .application-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .application-label {
          font-weight: 600;
          color: #1f2937;
          font-size: 13px;
        }
        .application-value {
          color: #4b5563;
          font-size: 13px;
        }
        .action-button {
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📬 New Application Received</h1>
          <p>via FIND Job Platform</p>
        </div>

        <div class="content">
          <h2>You have a new job application!</h2>
          
          <p>Great news! A candidate has applied for your job opening. Here are the details:</p>

          <div class="application-card">
            <div class="application-row">
              <span class="application-label">Applicant Name:</span>
              <span class="application-value">${applicantName}</span>
            </div>
            <div class="application-row">
              <span class="application-label">Job Title:</span>
              <span class="application-value">${jobTitle}</span>
            </div>
            <div class="application-row">
              <span class="application-label">Company:</span>
              <span class="application-value">${companyName}</span>
            </div>
            <div class="application-row">
              <span class="application-label">Email:</span>
              <span class="application-value">${applicantEmail}</span>
            </div>
            <div class="application-row">
              <span class="application-label">Applied At:</span>
              <span class="application-value">${new Date().toLocaleString()}</span>
            </div>
          </div>

          <p>The candidate's resume and cover letter are available on the FIND admin panel.</p>

          <div style="text-align: center;">
            <a href="https://find-platform.com/admin" class="action-button">
              View Application
            </a>
          </div>

          <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
            Log in to your admin panel to review the full application, contact the candidate, or manage the hiring process.
          </p>
        </div>

        <div class="footer">
          <p>© 2026 FIND. All rights reserved.</p>
          <p>This is an automated message from FIND job platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailTemplate = (userName: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FIND</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .content p {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          padding: 12px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Welcome ${userName}! 🎉</h1>
        </div>

        <div class="content">
          <p>Your email has been verified and your account is now active!</p>
          
          <p>You're all set to start using FIND. Explore jobs, connect with roommates, book taxis, and much more.</p>

          <div style="text-align: center;">
            <a href="https://find-platform.com" class="cta-button">
              Go to FIND
            </a>
          </div>

          <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
            Have any questions? Visit our <a href="https://find-platform.com/faq" style="color: #dc2626; text-decoration: none;">FAQ</a> or <a href="https://find-platform.com/contact" style="color: #dc2626; text-decoration: none;">contact us</a>.
          </p>
        </div>

        <div class="footer">
          <p>© 2026 FIND. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
