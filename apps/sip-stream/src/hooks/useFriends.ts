'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserProfile, Friend, Notification } from '../lib/types/database';

interface FriendWithProfile extends Friend {
  friend_profile: UserProfile;
}

export function useFriends() {
  const { supabase, user } = useAuth();
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendWithProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFriends();
      fetchPendingRequests();
      fetchNotifications();
      subscribeToUpdates();
    }
  }, [user]);

  async function fetchUserProfile() {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" - user profile doesn't exist yet
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Create user profile if it doesn't exist
        await createUserProfile();
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    }
  }

  async function createUserProfile() {
    if (!supabase || !user) return;

    try {
      const username = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          username,
          display_name: user.email?.split('@')[0] || 'Anonymous',
          status: 'online',
        })
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (err) {
      console.error('Error creating user profile:', err);
    }
  }

  async function fetchFriends() {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('friends')
        .select(
          `
          *,
          friend_profile:user_profiles(*)
        `
        )
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setFriends(data || []);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  }

  async function fetchPendingRequests() {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('friends')
        .select(
          `
          *,
          friend_profile:user_profiles(*)
        `
        )
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  }

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

  function subscribeToUpdates() {
    if (!supabase || !user) return;

    // Subscribe to friends updates
    const friendsSubscription = supabase
      .channel(`friends:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `user_id=eq.${user.id} OR friend_id=eq.${user.id}`,
        },
        () => {
          fetchFriends();
          fetchPendingRequests();
        }
      )
      .subscribe();

    // Subscribe to notifications
    const notificationsSubscription = supabase
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
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    // Subscribe to user profile updates
    const profileSubscription = supabase
      .channel(`profile:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user.id}`,
        },
        payload => {
          if (payload.eventType === 'UPDATE') {
            setUserProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      friendsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
      profileSubscription.unsubscribe();
    };
  }

  async function updateUserStatus(status: UserProfile['status']) {
    if (!supabase || !user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          status,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  }

  async function searchUsers(query: string) {
    if (!supabase || !user || !query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching users:', err);
      return [];
    }
  }

  async function sendFriendRequest(friendId: string) {
    if (!supabase || !user) return false;

    try {
      const { error } = await supabase.from('friends').insert({
        user_id: user.id,
        friend_id: friendId,
        status: 'pending',
      });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      return false;
    }
  }

  async function acceptFriendRequest(requestId: string) {
    if (!supabase || !user) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      // Refresh friends and pending requests
      fetchFriends();
      fetchPendingRequests();
      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      return false;
    }
  }

  async function declineFriendRequest(requestId: string) {
    if (!supabase || !user) return false;

    try {
      const { error } = await supabase.from('friends').delete().eq('id', requestId);

      if (error) throw error;

      fetchPendingRequests();
      return true;
    } catch (err) {
      console.error('Error declining friend request:', err);
      return false;
    }
  }

  async function removeFriend(friendId: string) {
    if (!supabase || !user) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      if (error) throw error;

      fetchFriends();
      return true;
    } catch (err) {
      console.error('Error removing friend:', err);
      return false;
    }
  }

  async function markNotificationAsRead(notificationId: string) {
    if (!supabase || !user) return false;

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
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);

  return {
    friends,
    pendingRequests,
    notifications,
    unreadNotifications,
    userProfile,
    loading,
    updateUserStatus,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    markNotificationAsRead,
  };
}
