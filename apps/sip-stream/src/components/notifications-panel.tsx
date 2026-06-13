'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { useAuth } from '../hooks/useAuth';
import { Notification, UserProfile } from '../lib/types/database';

interface NotificationsPanelProps {
  visible: boolean;
  onHide: () => void;
}

interface NotificationWithUser extends Notification {
  sender_profile?: UserProfile;
}

export function NotificationsPanel({ visible, onHide }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { supabase, user } = useAuth();

  useEffect(() => {
    if (visible && user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [visible, user]);

  async function fetchNotifications() {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }

  function subscribeToNotifications() {
    if (!supabase || !user) return;

    const subscription = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        payload => {
          setNotifications(prev => [payload.new as NotificationWithUser, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function markAsRead(notificationId: string) {
    if (!supabase || !user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }

  async function handleFriendRequest(notificationId: string, action: 'accept' | 'decline') {
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || !notification.data) return;

      const requestId = notification.data.request_id as string;

      if (action === 'accept') {
        // Accept friend request
        const { error } = await supabase
          .from('friends')
          .update({ status: 'accepted' })
          .eq('id', requestId);

        if (error) throw error;

        toast.current?.show({
          severity: 'success',
          summary: 'Friend Request Accepted',
          detail: 'You are now friends!',
          life: 3000,
        });
      } else {
        // Decline friend request
        const { error } = await supabase.from('friends').delete().eq('id', requestId);

        if (error) throw error;

        toast.current?.show({
          severity: 'info',
          summary: 'Friend Request Declined',
          detail: 'Friend request has been declined',
          life: 3000,
        });
      }

      // Mark notification as read
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Error handling friend request:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to process friend request',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGameInvitation(notificationId: string, action: 'accept' | 'decline') {
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || !notification.data) return;

      const gameId = notification.data.game_id as string;
      const invitationId = notification.data.invitation_id as string;

      if (action === 'accept') {
        // Accept game invitation
        const { error } = await supabase
          .from('game_invitations')
          .update({ status: 'accepted' })
          .eq('id', invitationId);

        if (error) throw error;

        // Add user to game players
        const { data: game } = await supabase
          .from('games')
          .select('players')
          .eq('id', gameId)
          .single();

        if (game) {
          const updatedPlayers = [...game.players, user.email || 'Anonymous'];
          await supabase.from('games').update({ players: updatedPlayers }).eq('id', gameId);
        }

        toast.current?.show({
          severity: 'success',
          summary: 'Game Invitation Accepted',
          detail: 'You have joined the game!',
          life: 3000,
        });
      } else {
        // Decline game invitation
        const { error } = await supabase
          .from('game_invitations')
          .update({ status: 'declined' })
          .eq('id', invitationId);

        if (error) throw error;

        toast.current?.show({
          severity: 'info',
          summary: 'Game Invitation Declined',
          detail: 'Game invitation has been declined',
          life: 3000,
        });
      }

      // Mark notification as read
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Error handling game invitation:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to process game invitation',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'friend_request':
        return 'pi pi-user-plus';
      case 'game_invite':
        return 'pi pi-gamepad';
      case 'game_update':
        return 'pi pi-info-circle';
      case 'friend_joined_game':
        return 'pi pi-users';
      default:
        return 'pi pi-bell';
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case 'friend_request':
        return 'blue';
      case 'game_invite':
        return 'green';
      case 'game_update':
        return 'orange';
      case 'friend_joined_game':
        return 'purple';
      default:
        return 'gray';
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        visible={visible}
        onHide={onHide}
        header={
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && <Badge value={unreadCount} severity="danger" />}
          </div>
        }
        className="w-full max-w-md"
        modal
      >
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No notifications yet</p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full bg-${getNotificationColor(notification.type)}-100`}
                  >
                    <i
                      className={`${getNotificationIcon(
                        notification.type
                      )} text-${getNotificationColor(notification.type)}-600`}
                    ></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>

                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {notification.requires_action && !notification.is_read && (
                      <div className="flex gap-2 mt-3">
                        {notification.type === 'friend_request' && (
                          <>
                            <Button
                              label="Accept"
                              size="small"
                              className="p-button-sm p-button-success"
                              loading={loading}
                              onClick={() => handleFriendRequest(notification.id, 'accept')}
                            />
                            <Button
                              label="Decline"
                              size="small"
                              className="p-button-sm p-button-outlined p-button-danger"
                              loading={loading}
                              onClick={() => handleFriendRequest(notification.id, 'decline')}
                            />
                          </>
                        )}

                        {notification.type === 'game_invite' && (
                          <>
                            <Button
                              label="Join"
                              size="small"
                              className="p-button-sm p-button-success"
                              loading={loading}
                              onClick={() => handleGameInvitation(notification.id, 'accept')}
                            />
                            <Button
                              label="Decline"
                              size="small"
                              className="p-button-sm p-button-outlined p-button-danger"
                              loading={loading}
                              onClick={() => handleGameInvitation(notification.id, 'decline')}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Dialog>
    </>
  );
}
