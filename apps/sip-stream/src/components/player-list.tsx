'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';

interface PlayerListProps {
  players: string[];
  onPlayersChange: (players: string[]) => void;
}

export function PlayerList({ players, onPlayersChange }: PlayerListProps) {
  const [newPlayer, setNewPlayer] = useState('');

  function addPlayer() {
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      onPlayersChange([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  }

  function removePlayer(playerToRemove: string) {
    onPlayersChange(players.filter(player => player !== playerToRemove));
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlayer();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <InputText
          value={newPlayer}
          onChange={e => setNewPlayer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter player name"
          className="flex-1"
        />
        <Button
          icon="pi pi-plus"
          onClick={addPlayer}
          disabled={!newPlayer.trim() || players.includes(newPlayer.trim())}
          className="p-button-rounded"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {players.map(player => (
          <Chip
            key={player}
            label={player}
            removable
            onRemove={() => {
              removePlayer(player);
              return true;
            }}
            className="bg-orange-600"
          />
        ))}
      </div>

      {players.length === 0 && <p className="text-orange-200 text-sm">No players added yet</p>}
    </div>
  );
}
