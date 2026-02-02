export const getVerificationEmailHtml = (url: string, userEmail: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
              <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                      <tr>
                          <td style="padding: 48px 40px 32px; text-align: center; background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); border-radius: 12px 12px 0 0;">
                              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background-color: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                                  <span style="font-size: 32px;">💊</span>
                              </div>
                              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">MediStore</h1>
                              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Trusted Medicine Shop</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 48px 40px;">
                              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 600;">Verify Your Email</h2>
                              <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                                  Hi there! 👋<br/><br/>
                                  Welcome to MediStore. We're excited to have you! Click the button below to verify your email address and get started.
                              </p>
                              <table role="presentation" style="margin: 32px 0;">
                                  <tr>
                                      <td style="border-radius: 8px; background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                                          <a href="${url}" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; letter-spacing: 0.3px;">
                                              Verify Email Address
                                          </a>
                                      </td>
                                  </tr>
                              </table>
                              <div style="margin: 32px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 4px;">
                                  <p style="margin: 0 0 8px; color: #475569; font-size: 14px; font-weight: 600;">
                                      Button not working?
                                  </p>
                                  <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5; word-break: break-all;">
                                      Copy and paste this link:<br/>
                                      <a href="${url}" style="color: #0ea5e9; text-decoration: none;">${url}</a>
                                  </p>
                              </div>
                              <div style="margin: 32px 0 0; padding: 20px 0 0; border-top: 1px solid #e2e8f0;">
                                  <p style="margin: 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                                      If you didn't create an account with MediStore, you can safely ignore this email.
                                  </p>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 32px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 12px 12px;">
                              <p style="margin: 0 0 8px; color: #64748b; font-size: 14px; font-weight: 600;">
                                  Need help?
                              </p>
                              <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                                  Contact us at <a href="mailto:support@medistore.com" style="color: #0ea5e9; text-decoration: none;">support@medistore.com</a>
                              </p>
                              <p style="margin: 16px 0 0; color: #cbd5e1; font-size: 12px;">
                                  © ${new Date().getFullYear()} MediStore. All rights reserved.
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `;
};