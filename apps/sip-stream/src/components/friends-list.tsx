'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { useAuth } from '../hooks/useAuth';
import { UserProfile, Friend } from '../lib/types/database';

interface FriendsListProps {
  visible: boolean;
  onHide: () => void;
}

interface FriendWithProfile extends Friend {
  friend_profile: UserProfile;
}

export function FriendsList({ visible, onHide }: FriendsListProps) {
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const toast = useRef<Toast>(null);
  const { supabase, user } = useAuth();

  useEffect(() => {
    if (visible && user) {
      fetchFriends();
    }
  }, [visible, user]);

  async function fetchFriends() {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('friends')
        .select(
          `
          *,
          friend_profile:user_profiles!friends_friend_id_fkey(*)
        `
        )
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setFriends(data || []);
    } catch (err) {
      console.error('Error fetching friends:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load friends',
        life: 3000,
      });
    }
  }

  async function searchUsers(query: string) {
    if (!supabase || !user || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearching(false);
    }
  }

  async function sendFriendRequest(friendId: string) {
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('friends').insert({
        user_id: user.id,
        friend_id: friendId,
        status: 'pending',
      });

      if (error) throw error;

      toast.current?.show({
        severity: 'success',
        summary: 'Friend Request Sent',
        detail: 'Your friend request has been sent!',
        life: 3000,
      });

      setShowAddFriend(false);
      setUsernameToAdd('');
      setSearchResults([]);
    } catch (err) {
      console.error('Error sending friend request:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send friend request',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function inviteToGame() {
    if (!supabase || !user) return;

    // For now, we'll just show a toast. In a real implementation,
    // you'd create a game invitation
    toast.current?.show({
      severity: 'info',
      summary: 'Game Invitation',
      detail: 'Game invitation feature coming soon!',
      life: 3000,
    });
  }

  async function removeFriend(friendId: string) {
    if (!supabase || !user) return;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      if (error) throw error;

      setFriends(prev => prev.filter(f => f.friend_id !== friendId));
      toast.current?.show({
        severity: 'success',
        summary: 'Friend Removed',
        detail: 'Friend has been removed from your list',
        life: 3000,
      });
    } catch (err) {
      console.error('Error removing friend:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to remove friend',
        life: 3000,
      });
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'online':
        return 'success';
      case 'in_game':
        return 'warning';
      case 'away':
        return 'info';
      default:
        return 'secondary';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'online':
        return 'Online';
      case 'in_game':
        return 'In Game';
      case 'away':
        return 'Away';
      default:
        return 'Offline';
    }
  }

  const filteredFriends = friends.filter(
    friend =>
      friend.friend_profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.friend_profile.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Toast ref={toast} />

      <Dialog visible={visible} onHide={onHide} header="Friends" className="w-full max-w-md" modal>
        <div className="space-y-4">
          {/* Search and Add Friend */}
          <div className="flex gap-2">
            <InputText
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search friends..."
              className="flex-1"
            />
            <Button
              icon="pi pi-plus"
              onClick={() => setShowAddFriend(true)}
              className="p-button-outlined"
              tooltip="Add Friend"
            />
          </div>

          {/* Friends List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFriends.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {searchQuery
                  ? 'No friends found'
                  : 'No friends yet. Add some friends to get started!'}
              </p>
            ) : (
              filteredFriends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      image={friend.friend_profile.avatar_url || undefined}
                      label={
                        friend.friend_profile.display_name?.[0] || friend.friend_profile.username[0]
                      }
                      size="normal"
                      shape="circle"
                    />
                    <div>
                      <p className="font-medium">
                        {friend.friend_profile.display_name || friend.friend_profile.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          value={getStatusText(friend.friend_profile.status)}
                          severity={getStatusColor(friend.friend_profile.status)}
                        />
                        {friend.friend_profile.status === 'in_game' && (
                          <span className="text-xs text-orange-600">Playing</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {friend.friend_profile.status !== 'in_game' && (
                      <Button
                        icon="pi pi-gamepad"
                        size="small"
                        className="p-button-outlined p-button-sm"
                        onClick={() => inviteToGame()}
                        tooltip="Invite to Game"
                      />
                    )}
                    <Button
                      icon="pi pi-trash"
                      size="small"
                      className="p-button-outlined p-button-danger p-button-sm"
                      onClick={() => removeFriend(friend.friend_id)}
                      tooltip="Remove Friend"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Dialog>

      {/* Add Friend Dialog */}
      <Dialog
        visible={showAddFriend}
        onHide={() => setShowAddFriend(false)}
        header="Add Friend"
        className="w-full max-w-md"
        modal
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Search by Username
            </label>
            <InputText
              id="username"
              value={usernameToAdd}
              onChange={e => {
                setUsernameToAdd(e.target.value);
                searchUsers(e.target.value);
              }}
              placeholder="Enter username..."
              className="w-full"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium">Search Results</h4>
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      image={user.avatar_url || undefined}
                      label={user.display_name?.[0] || user.username[0]}
                      size="normal"
                      shape="circle"
                    />
                    <div>
                      <p className="font-medium">{user.display_name || user.username}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  <Button
                    label="Add"
                    size="small"
                    className="p-button-sm"
                    loading={loading}
                    onClick={() => sendFriendRequest(user.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {searching && (
            <div className="text-center py-4">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem' }}></i>
              <p className="mt-2">Searching...</p>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
