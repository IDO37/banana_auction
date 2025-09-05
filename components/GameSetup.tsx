'use client';

import { useState } from 'react';

interface GameSetupProps {
  onStartGame: (playerCount: number, targetBananas: number) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [targetBananas, setTargetBananas] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame(playerCount, targetBananas);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🍌 바나나 경매 게임 설정
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700 mb-2">
            플레이어 수
          </label>
          <input
            type="number"
            id="playerCount"
            min="2"
            max="10"
            value={playerCount}
            onChange={(e) => setPlayerCount(parseInt(e.target.value) || 2)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-banana-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">최소 2명, 최대 10명</p>
        </div>

        <div>
          <label htmlFor="targetBananas" className="block text-sm font-medium text-gray-700 mb-2">
            목표 바나나 개수
          </label>
          <input
            type="number"
            id="targetBananas"
            min="10"
            value={targetBananas}
            onChange={(e) => setTargetBananas(parseInt(e.target.value) || 50)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-banana-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">각 플레이어는 시작 시 바나나 10개를 가집니다</p>
        </div>

        <button
          type="submit"
          className="w-full bg-banana-500 hover:bg-banana-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          게임 시작
        </button>
      </form>
    </div>
  );
}
