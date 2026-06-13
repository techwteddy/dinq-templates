'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useIcon } from '../components/icon-provider';

export default function HomePage() {
  const { user, loading, supabase } = useAuth();
  const icon = useIcon();
  const router = useRouter();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [gameId, setGameId] = useState('');
  const [joining, setJoining] = useState(false);
  const toast = useRef<Toast>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center fade-in">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  async function handleJoinGame() {
    if (!gameId.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Game ID Required',
        detail: 'Please enter a game ID',
        life: 3000,
      });
      return;
    }

    if (!supabase || !user) {
      toast.current?.show({
        severity: 'error',
        summary: 'Authentication Required',
        detail: 'Please sign in to join a game',
        life: 3000,
      });
      return;
    }

    setJoining(true);

    try {
      // Check if game exists
      const { data: game, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .eq('is_active', true)
        .single();

      if (error || !game) {
        toast.current?.show({
          severity: 'error',
          summary: 'Game Not Found',
          detail: 'The game ID is invalid or the game has ended',
          life: 3000,
        });
        return;
      }

      // Add user to game if not already in it
      if (!game.players.includes(user.email || 'Anonymous')) {
        const updatedPlayers = [...game.players, user.email || 'Anonymous'];
        await supabase.from('games').update({ players: updatedPlayers }).eq('id', gameId);
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Joined Game!',
        detail: 'You have successfully joined the game',
        life: 2000,
      });

      setShowJoinDialog(false);
      setGameId('');

      // Redirect to game after a short delay
      setTimeout(() => {
        router.push(`/${gameId}/dashboard`);
      }, 1000);
    } catch (err) {
      console.error('Error joining game:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to join game. Please try again.',
        life: 3000,
      });
    } finally {
      setJoining(false);
    }
  }

  return (
    <>
      <Toast ref={toast} />

      <main className="min-h-screen flex flex-col items-center justify-center p-4 fade-in">
        <div className="text-center space-y-8 slide-up">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4 scale-in">
            <img
              src={icon}
              alt="SipStream Logo"
              className="w-16 h-16 rounded-full shadow-lg bg-white/80"
              style={{ objectFit: 'cover' }}
            />
            SipStream
          </h1>
          <p className="text-xl text-orange-200 mb-8">The ultimate real-time drinking card game</p>

          <div className="space-y-4">
            {user ? (
              <>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link href="/create">
                    <Button label="Create New Game" className="w-full md:w-auto p-button-lg" />
                  </Link>
                  <Button
                    label="Join Game"
                    severity="secondary"
                    className="w-full md:w-auto p-button-lg"
                    onClick={() => setShowJoinDialog(true)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link href="/friends">
                    <Button
                      label="Friends"
                      severity="info"
                      className="w-full md:w-auto p-button-lg"
                    />
                  </Link>
                  <Link href="/notifications">
                    <Button
                      label="Notifications"
                      severity="warning"
                      className="w-full md:w-auto p-button-lg"
                    />
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button
                  label="Get Started"
                  className="w-full md:w-auto p-button-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                />
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Join Game Dialog */}
      <Dialog
        visible={showJoinDialog}
        onHide={() => setShowJoinDialog(false)}
        header="Join a Game"
        className="w-full max-w-md"
        modal
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="gameId" className="block text-sm font-medium mb-2">
              Game ID
            </label>
            <InputText
              id="gameId"
              value={gameId}
              onChange={e => setGameId(e.target.value)}
              placeholder="Enter game ID..."
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              label="Join Game"
              onClick={handleJoinGame}
              loading={joining}
              className="flex-1"
            />
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setShowJoinDialog(false)}
              className="flex-1"
            />
          </div>

          <p className="text-sm text-gray-500 text-center">
            Ask the game host for the game ID to join their game
          </p>
        </div>
      </Dialog>
    </>
  );
}
