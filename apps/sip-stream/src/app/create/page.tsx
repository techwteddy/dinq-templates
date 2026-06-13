'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useIcon } from '../../components/icon-provider';

const gameTypes = [
  { label: 'Kings Cup', value: 'kings-cup' },
  { label: 'Never Have I Ever', value: 'never-have-i-ever' },
  { label: 'Custom Deck', value: 'custom-deck' },
];

export default function CreatePage() {
  const [gameName, setGameName] = useState('');
  const [selectedGameType, setSelectedGameType] = useState(gameTypes[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { supabase, user } = useAuth();
  const toast = useRef<Toast>(null);
  const icon = useIcon();

  async function handleCreateGame() {
    console.log('CreatePage: handleCreateGame called with:', { gameName, selectedGameType });

    if (!gameName.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Game Name Required',
        detail: 'Please enter a game name',
        life: 3000,
      });
      return;
    }

    if (!supabase) {
      console.error('CreatePage: Supabase client is null');
      toast.current?.show({
        severity: 'error',
        summary: 'Connection Error',
        detail: 'Unable to connect to game server. Please refresh the page.',
        life: 5000,
      });
      return;
    }

    if (!user) {
      console.error('CreatePage: No authenticated user');
      toast.current?.show({
        severity: 'error',
        summary: 'Authentication Required',
        detail: 'Please sign in to create a game',
        life: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      console.log('CreatePage: Creating game...');
      console.log('CreatePage: selectedGameType:', selectedGameType);

      // Handle both object and string values for selectedGameType
      let gameTypeValue;
      if (typeof selectedGameType === 'string') {
        gameTypeValue = selectedGameType;
      } else if (selectedGameType?.value) {
        gameTypeValue = selectedGameType.value;
      } else {
        throw new Error('Invalid game type selected');
      }

      console.log('CreatePage: game_type value:', gameTypeValue);

      const gameData = {
        game_type: gameTypeValue,
        players: [user.email || 'Anonymous'],
        current_drinks: 0,
        current_player_index: 0,
        is_active: true,
        created_by: user.id,
      };

      console.log('CreatePage: Inserting game data:', gameData);

      const { data: game, error } = await supabase.from('games').insert(gameData).select().single();

      if (error) {
        console.error('CreatePage: Error creating game:', error);
        throw error;
      }

      console.log('CreatePage: Game created successfully:', game);

      toast.current?.show({
        severity: 'success',
        summary: 'Game Created!',
        detail: `Game "${gameName}" has been created successfully!`,
        life: 3000,
      });

      // Small delay to show success toast before redirect
      setTimeout(() => {
        router.push(`/${game.id}/dashboard`);
      }, 1000);
    } catch (err) {
      console.error('CreatePage: Error in handleCreateGame:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create game';

      toast.current?.show({
        severity: 'error',
        summary: 'Create Game Failed',
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="min-h-screen flex items-center justify-center p-4 fade-in">
        <div className="w-full max-w-md glossy-card p-6 space-y-6 slide-up">
          <h1 className="text-3xl font-bold text-center text-white mb-8 flex flex-col items-center justify-center gap-4 scale-in">
            <img
              src={icon}
              alt="Logo"
              className="w-12 h-12 rounded-full shadow bg-white/80"
              style={{ objectFit: 'cover' }}
            />
            Create New Game
          </h1>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="gameName" className="mb-2 font-medium text-white">
                Game Name
              </label>
              <InputText
                id="gameName"
                value={gameName}
                onChange={e => setGameName(e.target.value)}
                placeholder="Enter game name"
                className="w-full p-button-lg"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="gameType" className="mb-2 font-medium text-white">
                Game Type
              </label>
              <Dropdown
                id="gameType"
                value={selectedGameType}
                onChange={e => setSelectedGameType(e.value)}
                options={gameTypes}
                optionLabel="label"
                optionValue="value"
                placeholder="Select game type"
                className="w-full p-button-lg"
              />
            </div>

            <Button
              onClick={handleCreateGame}
              label="Create Game"
              className="w-full p-button-lg"
              loading={loading}
            />

            <Button
              onClick={() => router.push('/')}
              label="Back to Home"
              severity="secondary"
              className="w-full p-button-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
