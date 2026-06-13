'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { NotificationsPanel } from '../../components/notifications-panel';
import { useIcon } from '../../components/icon-provider';
import Link from 'next/link';

export default function NotificationsPage() {
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(true);
  const icon = useIcon();

  return (
    <main className="min-h-screen p-4 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={icon}
              alt="Logo"
              className="w-12 h-12 rounded-full shadow bg-white/80"
              style={{ objectFit: 'cover' }}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="text-orange-200">Stay updated with your game activities</p>
            </div>
          </div>
          <Link href="/">
            <Button icon="pi pi-arrow-left" className="p-button-outlined" tooltip="Back to Home" />
          </Link>
        </div>

        {/* Notifications Panel */}
        <NotificationsPanel
          visible={showNotificationsPanel}
          onHide={() => setShowNotificationsPanel(false)}
        />
      </div>
    </main>
  );
}
