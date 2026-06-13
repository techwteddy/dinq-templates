import * as React from 'react'

interface RoleChangedEmailProps {
  userName: string
  oldRoles: string[]
  newRoles: string[]
  changedBy: string
  supportEmail?: string
}

export function RoleChangedEmail({
  userName,
  oldRoles,
  newRoles,
  changedBy,
  supportEmail = 'support@repairshop.com',
}: RoleChangedEmailProps) {
  const addedRoles = newRoles.filter(role => !oldRoles.includes(role))
  const removedRoles = oldRoles.filter(role => !newRoles.includes(role))

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
          .info-box {
            background: white;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .role-badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            margin: 4px;
          }
          .removed {
            background: #ef4444;
            text-decoration: line-through;
          }
          .added {
            background: #10b981;
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
          <h1 style={{ margin: 0, fontSize: '28px' }}>Role Assignment Updated</h1>
        </div>
        <div className="content">
          <p style={{ fontSize: '16px' }}>
            Hi <strong>{userName}</strong>,
          </p>

          <p>Your role assignments have been updated by {changedBy}.</p>

          <div className="info-box">
            {removedRoles.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', fontWeight: '600', color: '#ef4444' }}>
                  Roles Removed:
                </p>
                <div>
                  {removedRoles.map((role, index) => (
                    <span key={index} className="role-badge removed">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {addedRoles.length > 0 && (
              <div>
                <p style={{ margin: '5px 0', fontWeight: '600', color: '#10b981' }}>Roles Added:</p>
                <div>
                  {addedRoles.map((role, index) => (
                    <span key={index} className="role-badge added">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {addedRoles.length === 0 && removedRoles.length === 0 && (
              <div>
                <p style={{ margin: '5px 0', fontWeight: '600' }}>Current Roles:</p>
                <div>
                  {newRoles.map((role, index) => (
                    <span key={index} className="role-badge">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h3 style={{ marginTop: '30px' }}>What This Means:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Your access permissions may have changed</li>
            <li>You may see different features and options</li>
            <li>Some actions may now require different permissions</li>
          </ul>

          <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            If you have questions about your new role assignments, please contact your administrator
            or reach out to us at{' '}
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
