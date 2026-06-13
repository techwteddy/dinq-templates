import * as React from 'react'

interface AccountStatusChangedEmailProps {
  userName: string
  newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  changedBy: string
  reason?: string
  supportEmail?: string
}

export function AccountStatusChangedEmail({
  userName,
  newStatus,
  changedBy,
  reason,
  supportEmail = 'support@repairshop.com',
}: AccountStatusChangedEmailProps) {
  const statusConfig = {
    ACTIVE: {
      color: '#10b981',
      title: 'Account Activated',
      icon: '✅',
      message: 'Your account has been activated and you now have full access to the system.',
    },
    INACTIVE: {
      color: '#f59e0b',
      title: 'Account Deactivated',
      icon: '⚠️',
      message:
        'Your account has been temporarily deactivated. You will not be able to log in until it is reactivated.',
    },
    SUSPENDED: {
      color: '#ef4444',
      title: 'Account Suspended',
      icon: '🚫',
      message:
        'Your account has been suspended. You will not be able to access the system until the suspension is lifted.',
    },
  }

  const config = statusConfig[newStatus]

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
          .status-box {
            background: white;
            border-left: 4px solid ${config.color};
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .status-badge {
            display: inline-block;
            background: ${config.color};
            color: white;
            padding: 6px 16px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
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
          <h1 style={{ margin: 0, fontSize: '28px' }}>
            {config.icon} {config.title}
          </h1>
        </div>
        <div className="content">
          <p style={{ fontSize: '16px' }}>
            Hi <strong>{userName}</strong>,
          </p>

          <p>{config.message}</p>

          <div className="status-box">
            <p style={{ margin: '5px 0', fontWeight: '600', color: '#666' }}>Account Status:</p>
            <span className="status-badge">{newStatus}</span>

            <p style={{ margin: '15px 0 5px', fontSize: '14px', color: '#666' }}>
              Changed by: <strong>{changedBy}</strong>
            </p>

            {reason && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '5px 0', fontWeight: '600', color: '#666' }}>Reason:</p>
                <p
                  style={{
                    margin: '5px 0',
                    padding: '10px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  {reason}
                </p>
              </div>
            )}
          </div>

          {newStatus === 'ACTIVE' && (
            <>
              <h3 style={{ marginTop: '30px' }}>What You Can Do Now:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Log in to your account</li>
                <li>Access all features based on your assigned roles</li>
                <li>Perform actions according to your permissions</li>
              </ul>
            </>
          )}

          {(newStatus === 'INACTIVE' || newStatus === 'SUSPENDED') && (
            <>
              <h3 style={{ marginTop: '30px' }}>What This Means:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>You cannot log in to your account</li>
                <li>All your access has been temporarily revoked</li>
                <li>Your data and settings are preserved</li>
              </ul>
            </>
          )}

          <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            If you have questions about this status change, please contact your administrator or
            reach out to us at{' '}
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
