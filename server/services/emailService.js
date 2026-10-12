import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transport (or resilient simulated dev transport)
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass }
    });
  }

  // Dev mode: Simulated console email transporter with zero third-party block
  return null;
}

/**
 * Send Password Reset Email with responsive branded HTML template
 */
export async function sendPasswordResetEmail({ to, name, resetToken, resetCode }) {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || 'KaamSetu Security <no-reply@kaamsetu.in>';
  const resetLink = `http://localhost:5173/?resetToken=${resetToken}&email=${encodeURIComponent(to)}`;

  const subject = '🔒 KaamSetu - Password Reset Request / पासवर्ड रीसेट लिंक';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #064e3b 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
        .logo-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 13px; font-weight: bold; padding: 3px 10px; border-radius: 999px; margin-left: 6px; }
        .body { padding: 32px 28px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
        .code-box { background: #f0fdf4; border: 2px dashed #10b981; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .code-title { font-size: 12px; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .code-number { font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #047857; font-family: monospace; }
        .btn-container { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background: #059669; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35); }
        .notice { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 12px 16px; border-radius: 10px; margin-top: 20px; }
        .footer { background: #0f172a; color: #94a3b8; padding: 20px; font-size: 11px; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">KaamSetu<span style="color: #34d399;">AI</span> <span class="logo-badge">कामसेतू</span></div>
          <p style="margin: 8px 0 0; font-size: 13px; color: #a7f3d0;">Empowering Artisans & Employers Across Maharashtra</p>
        </div>
        <div class="body">
          <div class="greeting">Namaste ${name || 'User'},</div>
          <p>We received a request to reset your password for your <strong>KaamSetu</strong> account (${to}).</p>
          <p>You can reset your password using your 6-digit verification code below or by clicking the direct reset button:</p>
          
          <div class="code-box">
            <div class="code-title">Your 6-Digit Password Reset Code</div>
            <div class="code-number">${resetCode}</div>
            <div style="font-size: 11px; color: #059669; margin-top: 6px;">Valid for 15 minutes • 15 मिनिटांसाठी वैध</div>
          </div>

          <div class="btn-container">
            <a href="${resetLink}" class="btn">Click Here to Reset Password</a>
          </div>

          <div class="notice">
            🔒 <strong>Security Warning:</strong> If you did not request this password reset, please ignore this email. Your current password remains completely safe. Never share this code with anyone.
          </div>
        </div>
        <div class="footer">
          KaamSetu AI Digital Labor Platform • Maharashtra Pilot Hub<br>
          Bindu Chowk, Kolhapur & Swargate, Pune • Support: support@kaamsetu.in
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html: htmlContent
      });
      console.log(`📧 [EMAIL SENT] Password reset email delivered to ${to} (MessageId: ${info.messageId})`);
      return { success: true, delivered: true, to };
    } catch (err) {
      console.error(`⚠️ [EMAIL ERROR] SMTP delivery failed: ${err.message}. Falling back to dev logger.`);
    }
  }

  // Dev / Fallback Mode: Print to console and return preview info
  console.log(`\n======================================================`);
  console.log(`📧 [SIMULATED EMAIL DISPATCH - DEV MODE]`);
  console.log(`To: ${to} (${name})`);
  console.log(`Subject: ${subject}`);
  console.log(`🔑 Reset Code: ${resetCode}`);
  console.log(`🔗 Direct Reset Link: ${resetLink}`);
  console.log(`======================================================\n`);

  return {
    success: true,
    delivered: false,
    mode: 'dev_preview',
    to,
    resetCode,
    resetLink
  };
}
