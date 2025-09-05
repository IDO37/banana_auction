'use client';

import { Player } from '@/types/game';

interface PlayerBiddingProps {
  players: Player[];
  onBidChange: (playerId: string, bid: number) => void;
  onNameChange: (playerId: string, name: string) => void;
  onStartAuction: () => void;
  auctionItem: number;
  canStartAuction: boolean;
  round: number;
  targetBananas: number;
}

export default function PlayerBidding({ 
  players, 
  onBidChange, 
  onNameChange,
  onStartAuction, 
  auctionItem,
  canStartAuction,
  round,
  targetBananas
}: PlayerBiddingProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🍌 바나나 경매
        </h2>
        <div className="bg-banana-100 border-2 border-banana-300 rounded-lg p-4 mb-4">
          <p className="text-lg text-gray-700 mb-2">이번 라운드 매물</p>
          <p className="text-4xl font-bold text-banana-600">
            {auctionItem}개
          </p>
          <p className="text-sm text-gray-600 mt-1">바나나</p>
        </div>
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">현재 라운드</p>
              <p className="text-xl font-bold text-gray-800">{round}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">목표 바나나</p>
              <p className="text-xl font-bold text-gray-800">{targetBananas}개</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.map((player) => (
          <div 
            key={player.id} 
            className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
          >
            <div className="mb-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => onNameChange(player.id, e.target.value)}
                onFocus={(e) => e.target.select()}
                className="font-bold text-lg bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-1 py-1 w-full"
                maxLength={10}
              />
            </div>
            
            <div className="mb-3">
              <span className="text-sm text-gray-600">보유 바나나: </span>
              <span className="font-bold text-banana-600">{player.bananas}개</span>
            </div>

            <div>
              <label htmlFor={`bid-${player.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                호가 입력
              </label>
              <input
                type="number"
                id={`bid-${player.id}`}
                min="0"
                max={player.bananas}
                value={player.bid}
                onChange={(e) => onBidChange(player.id, parseInt(e.target.value) || 0)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-banana-500 focus:border-transparent"
                disabled={player.isBankrupt && player.bankruptRound === round}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onStartAuction}
          disabled={!canStartAuction}
          className={`px-6 py-3 rounded-md font-bold text-white transition duration-200 ${
            canStartAuction
              ? 'bg-banana-500 hover:bg-banana-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          경매 진행
        </button>
        {!canStartAuction && (
          <p className="text-sm text-gray-500 mt-2">
            최소 1명 이상의 플레이어가 호가를 입력해야 합니다
          </p>
        )}
      </div>
    </div>
  );
}
