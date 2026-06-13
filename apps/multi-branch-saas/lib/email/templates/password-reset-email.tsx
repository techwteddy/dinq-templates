import * as React from 'react'

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
  expiresIn?: string
  supportEmail?: string
}

export function PasswordResetEmail({
  userName,
  resetUrl,
  expiresIn = '1 hour',
  supportEmail = 'support@repairshop.com',
}: PasswordResetEmailProps) {
  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #f9fafb;
            padding: 30px 20px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1 style={{ margin: 0, fontSize: '28px' }}>Password Reset Request</h1>
        </div>
        <div className="content">
          <p style={{ fontSize: '16px' }}>
            Hi <strong>{userName}</strong>,
          </p>

          <p>
            We received a request to reset the password for your RepairShop account. Click the
            button below to create a new password.
          </p>

          <div style={{ textAlign: 'center' }}>
            <a href={resetUrl} className="button">
              Reset Your Password
            </a>
          </div>

          <div className="warning-box">
            <p style={{ margin: '5px 0', fontWeight: '600', color: '#92400e' }}>
              ⚠️ Important Security Information
            </p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#78350f' }}>
              <li>
                This link will expire in <strong>{expiresIn}</strong>
              </li>
              <li>The link can only be used once</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
            <strong>Alternatively, you can copy and paste this URL into your browser:</strong>
          </p>
          <p
            style={{
              fontSize: '12px',
              color: '#667eea',
              wordBreak: 'break-all',
              background: '#fff',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
            }}
          >
            {resetUrl}
          </p>

          <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            If you didn't request a password reset, you can safely ignore this email. Your password
            will not be changed.
          </p>

          <p style={{ fontSize: '14px', color: '#666' }}>
            If you have any concerns, please contact us at{' '}
            <a href={`mailto:${supportEmail}`} style={{ color: '#667eea' }}>
              {supportEmail}
            </a>
          </p>
        </div>

        <div className="footer">
          <p>
            <strong>RepairShop</strong>
            <br />
            Branch Management System
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </body>
    </html>
  )
}
