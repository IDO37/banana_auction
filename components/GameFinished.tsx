'use client';

import { Player } from '@/types/game';

interface GameFinishedProps {
  winner: Player;
  players: Player[];
  targetBananas: number;
  onNewGame: () => void;
}

export default function GameFinished({ winner, players, targetBananas, onNewGame }: GameFinishedProps) {
  const sortedPlayers = [...players].sort((a, b) => b.bananas - a.bananas);
  const qualifiedPlayers = players.filter(p => p.bananas >= targetBananas);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-3xl font-bold text-banana-600 mb-2">
          게임 종료!
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🍌 {winner.name} 승리! 🍌
        </h2>
        <p className="text-lg text-gray-600">
          최종 보유 바나나: <span className="font-bold text-banana-600">{winner.bananas}개</span>
        </p>
        {qualifiedPlayers.length > 1 && (
          <p className="text-sm text-gray-500 mt-2">
            목표 달성 플레이어 {qualifiedPlayers.length}명 중 최다 보유자
          </p>
        )}
      </div>

      {/* 최종 순위 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">최종 순위</h3>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const isQualified = player.bananas >= targetBananas;
            return (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 
                    ? 'bg-banana-100 border-2 border-banana-300' 
                    : isQualified
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                  </span>
                  <span className="font-bold text-lg">
                    {player.name}
                    {isQualified && <span className="text-green-600 ml-2">(목표 달성)</span>}
                  </span>
                </div>
                <span className="font-bold text-banana-600 text-lg">
                  {player.bananas}개
                </span>
              </div>
            );
          })}
        </div>
      </div>


      <div className="text-center">
        <button
          onClick={onNewGame}
          className="px-8 py-3 bg-banana-500 hover:bg-banana-600 text-white font-bold rounded-md transition duration-200 text-lg"
        >
          새 게임 시작
        </button>
      </div>
    </div>
  );
}
