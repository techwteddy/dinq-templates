'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ShareGameModalProps {
  visible: boolean;
  onHide: () => void;
  gameId: string;
  gameType: string;
}

export function ShareGameModal({ visible, onHide, gameId, gameType }: ShareGameModalProps) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const toast = useRef<Toast>(null);
  const { supabase, user } = useAuth();

  const gameUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/${gameId}/dashboard` : '';
  const gameCode = gameId;

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.current?.show({
        severity: 'success',
        summary: 'Copied!',
        detail: 'Game code copied to clipboard',
        life: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.current?.show({
        severity: 'error',
        summary: 'Copy Failed',
        detail: 'Failed to copy to clipboard',
        life: 3000,
      });
    }
  }

  async function sendInvite() {
    if (!inviteEmail.trim() || !supabase || !user) return;

    setSendingInvite(true);
    try {
      // First, check if the user exists
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', inviteEmail.trim())
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (!userProfile) {
        toast.current?.show({
          severity: 'warn',
          summary: 'User Not Found',
          detail: 'No user found with that username. Make sure they have an account.',
          life: 4000,
        });
        return;
      }

      // Create game invitation
      const { error: inviteError } = await supabase.from('game_invitations').insert({
        game_id: gameId,
        inviter_id: user.id,
        invitee_id: userProfile.id,
        status: 'pending',
      });

      if (inviteError) throw inviteError;

      toast.current?.show({
        severity: 'success',
        summary: 'Invitation Sent!',
        detail: `Game invitation sent to ${inviteEmail}`,
        life: 3000,
      });

      setInviteEmail('');
    } catch (err) {
      console.error('Error sending invite:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Invitation Failed',
        detail: 'Failed to send game invitation',
        life: 3000,
      });
    } finally {
      setSendingInvite(false);
    }
  }

  async function shareViaWebShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my ${gameType.replace('-', ' ')} game!`,
          text: `Join my ${gameType.replace('-', ' ')} game on SipStream!`,
          url: gameUrl,
        });
      } catch {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to clipboard copy
      copyToClipboard(gameUrl);
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Share Game"
        className="w-full max-w-md"
        modal
      >
        <div className="space-y-6">
          {/* Game Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {gameType.replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600">Share this game with friends!</p>
          </div>

          {/* Game Code Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Game Code</label>
            <div className="flex gap-2">
              <InputText value={gameCode} readOnly className="flex-1 font-mono text-sm" />
              <Button
                icon={copied ? 'pi pi-check' : 'pi pi-copy'}
                onClick={() => copyToClipboard(gameCode)}
                className={copied ? 'p-button-success' : ''}
                tooltip="Copy game code"
              />
            </div>
            <p className="text-xs text-gray-500">
              Share this code with friends so they can join your game
            </p>
          </div>

          {/* Direct Link Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Direct Link</label>
            <div className="flex gap-2">
              <InputText value={gameUrl} readOnly className="flex-1 text-sm" />
              <Button
                icon="pi pi-copy"
                onClick={() => copyToClipboard(gameUrl)}
                tooltip="Copy link"
              />
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2">
            <Button
              label="Share Link"
              icon="pi pi-share-alt"
              onClick={shareViaWebShare}
              className="flex-1"
            />
            <Button
              label="Copy Code"
              icon="pi pi-copy"
              onClick={() => copyToClipboard(gameCode)}
              severity="secondary"
              className="flex-1"
            />
          </div>

          {/* Invite by Username */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Invite by Username</label>
            <div className="flex gap-2">
              <InputText
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="Enter username"
                className="flex-1"
                onKeyPress={e => e.key === 'Enter' && sendInvite()}
              />
              <Button
                label="Invite"
                icon="pi pi-send"
                onClick={sendInvite}
                loading={sendingInvite}
                disabled={!inviteEmail.trim()}
              />
            </div>
            <p className="text-xs text-gray-500">
              Send a direct invitation to a friend&apos;s username
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">How to join:</h4>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Share the game code or link with friends</li>
              <li>2. They can join by entering the code on the homepage</li>
              <li>3. Or they can click the direct link</li>
              <li>4. Or send them a direct invitation above</li>
            </ol>
          </div>
        </div>
      </Dialog>
    </>
  );
}
