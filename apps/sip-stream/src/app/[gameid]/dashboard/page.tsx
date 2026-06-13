'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DrinkCounter } from '../../../components/drink-counter';
import { SpeedDialMenu } from '../../../components/speed-dial-menu';
import { DrawCardModal } from '../../../components/draw-card-modal';
import { FriendsList } from '../../../components/friends-list';
import { NotificationsPanel } from '../../../components/notifications-panel';
import { GameTips } from '../../../components/game-tips';
import { ShareGameModal } from '../../../components/share-game-modal';
import { useGame } from '../../../hooks/useGame';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

import Link from 'next/link';

export default function GameDashboardPage() {
  const params = useParams();
  const gameId = params.gameid as string;
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardText, setCardText] = useState('');
  const [showFriends, setShowFriends] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { game, isLoading, error, decrementDrinks, nextTurn, updateGame, addHistoryEntry } =
    useGame(gameId);

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-900 to-red-700 text-white">
        <ProgressSpinner />
        <p className="mt-4">Loading game...</p>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-900 to-red-700 text-white">
        <Message severity="error" text={error || 'Game not found'} className="w-full max-w-md" />
        <Link href="/">
          <Button label="Go Home" className="mt-4" />
        </Link>
      </main>
    );
  }

  async function handleDrawCard() {
    if (!game) return;

    const cards = [
      '2 drinks to Sarah!',
      'Everyone drinks!',
      'Make a rule',
      'Waterfall - everyone drinks until the person to your right stops',
      'Pick someone to drink',
      'You drink!',
    ];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    setCardText(randomCard);
    setShowCardModal(true);
    await addHistoryEntry('card_drawn', game.players[game.current_player_index], {
      card: randomCard,
    });
  }

  async function handleAddDrinks(count: number) {
    if (!game) return;

    await updateGame({ current_drinks: game.current_drinks + count });
    await addHistoryEntry('drinks_added', 'Game Master', {
      drinks_added: count,
      new_total: game.current_drinks + count,
    });
  }

  const currentPlayer = game.players[game.current_player_index];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-orange-900 to-red-700 text-white">
      {/* Header with navigation and social buttons */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Link href="/">
          <Button icon="pi pi-arrow-left" className="p-button-text p-button-rounded" />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-users"
            className="p-button-text p-button-rounded"
            onClick={() => setShowFriends(true)}
            tooltip="Friends"
          />
          <Button
            icon="pi pi-bell"
            className="p-button-text p-button-rounded relative"
            onClick={() => setShowNotifications(true)}
            tooltip="Notifications"
          >
            {/* Notification badge would go here */}
          </Button>
          <Button
            icon="pi pi-share-alt"
            className="p-button-text p-button-rounded"
            onClick={() => setShowShareModal(true)}
            tooltip="Share Game"
          />
          <Link href={`/${gameId}/history`}>
            <Button icon="pi pi-history" className="p-button-text p-button-rounded" />
          </Link>
        </div>
      </div>

      {/* Game Title and Current Player */}
      <div className="text-center mb-8 mt-16">
        <h1 className="text-3xl font-bold mb-2">
          {game.game_type.replace('-', ' ').toUpperCase()}
        </h1>
        <p className="text-lg text-orange-200">Current Player: {currentPlayer}</p>
      </div>

      {/* Drink Counter */}
      <DrinkCounter
        drinks={game.current_drinks}
        onDecrement={decrementDrinks}
        disabled={isLoading}
      />

      {/* Players List */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Players</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {game.players.map((player, index) => (
            <div
              key={player}
              className={`px-3 py-1 rounded-full text-sm ${
                index === game.current_player_index
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-800 text-orange-200'
              }`}
            >
              {player}
            </div>
          ))}
        </div>
      </div>

      {/* Game Actions */}
      <SpeedDialMenu
        onNextTurn={nextTurn}
        onDrawCard={handleDrawCard}
        onAddDrinks={handleAddDrinks}
      />

      {/* Modals */}
      <DrawCardModal
        visible={showCardModal}
        onHide={() => setShowCardModal(false)}
        cardText={cardText}
      />

      <FriendsList visible={showFriends} onHide={() => setShowFriends(false)} />

      <NotificationsPanel visible={showNotifications} onHide={() => setShowNotifications(false)} />

      <ShareGameModal
        visible={showShareModal}
        onHide={() => setShowShareModal(false)}
        gameId={gameId}
        gameType={game.game_type}
      />

      {/* Game Tips */}
      <GameTips gameType={game.game_type} />
    </main>
  );
}
