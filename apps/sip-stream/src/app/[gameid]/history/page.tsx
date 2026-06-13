'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGame } from '../../../hooks/useGame';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import Link from 'next/link';

export default function GameHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameid as string;
  const { game, history, isLoading, error } = useGame(gameId);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 fade-in">
        <div className="text-center">
          <ProgressSpinner />
          <p className="text-white text-xl mt-4">Loading game history...</p>
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 fade-in">
        <div className="text-center">
          <Message
            severity="error"
            text={error || 'Game not found'}
            className="w-full max-w-md mb-4"
          />
          <Link href="/">
            <Button label="Go Home" className="mt-4" />
          </Link>
        </div>
      </main>
    );
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

  function getActionIcon(action: string) {
    switch (action) {
      case 'card_drawn':
        return 'pi pi-star';
      case 'drinks_added':
        return 'pi pi-plus-circle';
      case 'drink_taken':
        return 'pi pi-minus-circle';
      case 'next_turn':
        return 'pi pi-forward';
      default:
        return 'pi pi-info-circle';
    }
  }

  function getActionColor(action: string) {
    switch (action) {
      case 'card_drawn':
        return 'text-yellow-400';
      case 'drinks_added':
        return 'text-red-400';
      case 'drink_taken':
        return 'text-green-400';
      case 'next_turn':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  return (
    <main className="min-h-screen p-4 fade-in">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Game History</h1>
            <p className="text-orange-200">
              {game.game_type.replace('-', ' ').toUpperCase()} • {game.players.length} players
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              icon="pi pi-arrow-left"
              onClick={() => router.back()}
              className="p-button-outlined"
              tooltip="Go Back"
            />
            <Link href={`/${gameId}/dashboard`}>
              <Button icon="pi pi-gamepad" className="p-button-outlined" tooltip="Back to Game" />
            </Link>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glossy-card">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-1">Current Drinks</h3>
              <p className="text-3xl font-bold text-orange-400">{game.current_drinks}</p>
            </div>
          </Card>
          <Card className="glossy-card">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-1">Current Player</h3>
              <p className="text-xl text-orange-200">{game.players[game.current_player_index]}</p>
            </div>
          </Card>
          <Card className="glossy-card">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-1">Total Actions</h3>
              <p className="text-3xl font-bold text-blue-400">{history.length}</p>
            </div>
          </Card>
        </div>

        {/* History List */}
        <Card className="glossy-card">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Game Actions</h2>

            {history.length === 0 ? (
              <div className="text-center py-8">
                <i className="pi pi-history text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-300">
                  No actions recorded yet. Start playing to see the history!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className={`p-2 rounded-full bg-white/10 ${getActionColor(entry.action)}`}>
                      <i className={`${getActionIcon(entry.action)} text-lg`}></i>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{entry.player}</p>
                          <p className="text-sm text-gray-300">
                            {entry.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          {entry.details && Object.keys(entry.details).length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              {Object.entries(entry.details)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(entry.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
