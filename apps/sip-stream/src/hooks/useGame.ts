'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '../lib/providers/supabase-provider';
import { Game, GameHistory } from '../lib/types/database';

export function useGame(gameId: string) {
  const { supabase } = useSupabase();
  const [game, setGame] = useState<Game | null>(null);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !gameId) return;

    // Fetch initial game data
    async function fetchGame() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('games').select('*').eq('id', gameId).single();

        if (error) throw error;
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch game');
      } finally {
        setIsLoading(false);
      }
    }

    // Fetch game history
    async function fetchHistory() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('game_history')
          .select('*')
          .eq('game_id', gameId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    }

    fetchGame();
    fetchHistory();

    // Subscribe to real-time updates
    const gameSubscription = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        payload => {
          if (payload.eventType === 'UPDATE') {
            setGame(payload.new as Game);
          }
        }
      )
      .subscribe();

    const historySubscription = supabase
      .channel(`history:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_history',
          filter: `game_id=eq.${gameId}`,
        },
        payload => {
          setHistory(prev => [payload.new as GameHistory, ...prev]);
        }
      )
      .subscribe();

    return () => {
      gameSubscription.unsubscribe();
      historySubscription.unsubscribe();
    };
  }, [supabase, gameId]);

  async function updateGame(updates: Partial<Game>) {
    if (!supabase || !gameId) return;

    try {
      const { error } = await supabase.from('games').update(updates).eq('id', gameId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update game');
    }
  }

  async function addHistoryEntry(
    action: string,
    player: string,
    details?: Record<string, unknown>
  ) {
    if (!supabase || !gameId) return;

    try {
      const { error } = await supabase.from('game_history').insert({
        game_id: gameId,
        action,
        player,
        details,
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to add history entry:', err);
    }
  }

  async function decrementDrinks() {
    if (!game || game.current_drinks <= 0) return;

    await updateGame({ current_drinks: game.current_drinks - 1 });
    await addHistoryEntry('drink_taken', 'Player', { drinks_remaining: game.current_drinks - 1 });
  }

  async function nextTurn() {
    if (!game) return;

    const nextPlayerIndex = (game.current_player_index + 1) % game.players.length;
    await updateGame({ current_player_index: nextPlayerIndex });
    await addHistoryEntry('next_turn', game.players[nextPlayerIndex]);
  }

  return {
    game,
    history,
    isLoading,
    error,
    updateGame,
    addHistoryEntry,
    decrementDrinks,
    nextTurn,
  };
}
