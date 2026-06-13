import * as React from 'react'

interface WelcomeEmailProps {
  userName: string
  userEmail: string
  loginUrl: string
  supportEmail?: string
}

export function WelcomeEmail({
  userName,
  userEmail,
  loginUrl,
  supportEmail = 'support@repairshop.com',
}: WelcomeEmailProps) {
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
          .info-box {
            background: white;
            border-left: 4px solid #667eea;
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
          <h1 style={{ margin: 0, fontSize: '28px' }}>Welcome to RepairShop!</h1>
        </div>
        <div className="content">
          <p style={{ fontSize: '16px' }}>
            Hi <strong>{userName}</strong>,
          </p>

          <p>
            Welcome to RepairShop! Your account has been successfully created and you can now access
            the system.
          </p>

          <div className="info-box">
            <p style={{ margin: '5px 0' }}>
              <strong>Email:</strong> {userEmail}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              You'll use this email to log in to your account.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href={loginUrl} className="button">
              Log In to Your Account
            </a>
          </div>

          <h3 style={{ marginTop: '30px' }}>What's Next?</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Complete your profile information</li>
            <li>Explore the dashboard and features</li>
            <li>Contact your administrator if you need additional permissions</li>
          </ul>

          <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            If you didn't request this account or have any questions, please contact us at{' '}
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
