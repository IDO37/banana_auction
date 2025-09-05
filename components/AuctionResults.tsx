'use client';

import { Player, BidResult } from '@/types/game';

interface AuctionResultsProps {
  players: Player[];
  result: BidResult;
  auctionItem: number;
  onNextRound: () => void;
  onNewGame: () => void;
}

export default function AuctionResults({ 
  players, 
  result, 
  auctionItem, 
  onNextRound, 
  onNewGame 
}: AuctionResultsProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🍌 경매 결과
      </h2>

      {/* 경매 결과 요약 */}
      <div className="bg-banana-50 border border-banana-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-3 text-banana-800">경매 결과 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              1등 (최고 호가) {result.firstPlacePlayers.length > 1 && `(${result.firstPlacePlayers.length}명 공동)`}
            </p>
            {result.firstPlacePlayers.map((player, index) => (
              <div key={player.id} className="mb-2">
                <p className="font-bold text-banana-600">
                  {player.name}: {result.firstPlaceBid}개
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  바나나: {player.bananas - result.bananasToFirst}개 → {player.bananas}개
                </p>
              </div>
            ))}
          </div>
          {result.secondPlacePlayers.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">
                2등 {result.secondPlacePlayers.length > 1 && `(${result.secondPlacePlayers.length}명 공동)`}
              </p>
              {result.secondPlacePlayers.map((player, index) => (
                <div key={player.id} className="mb-2">
                  <p className="font-bold text-banana-600">
                    {player.name}: {result.secondPlaceBid}개
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    바나나: {player.bananas - result.bananasToSecond}개 → {player.bananas}개
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-banana-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">이번 라운드 매물</p>
              <p className="font-bold">{auctionItem}개</p>
            </div>
            <div>
              <p className="text-gray-600">2등에게 지급</p>
              <p className="font-bold text-green-600">+{result.bananasToSecond}개</p>
            </div>
            <div>
              <p className="text-gray-600">1등 손익</p>
              <p className={`font-bold ${result.bananasToFirst - result.bananasToSecond >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.bananasToFirst - result.bananasToSecond >= 0 ? '+' : ''}{result.bananasToFirst - result.bananasToSecond}개
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 플레이어별 현재 상태 */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3 text-gray-800">플레이어별 현재 상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <div 
              key={player.id} 
              className={`p-4 rounded-lg border-2 ${
                player.isBankrupt 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <h4 className="font-bold text-lg mb-2">
                {player.name}
                {player.isBankrupt && <span className="text-red-500 ml-2">(파산)</span>}
              </h4>
              
              <div className="space-y-1">
                <div>
                  <span className="text-sm text-gray-600">보유 바나나: </span>
                  <span className="font-bold text-banana-600">{player.bananas}개</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">입찰 호가: </span>
                  <span className="font-bold">{player.bid}개</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onNextRound}
          className="px-6 py-3 bg-banana-500 hover:bg-banana-600 text-white font-bold rounded-md transition duration-200"
        >
          다음 라운드
        </button>
        <button
          onClick={onNewGame}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md transition duration-200"
        >
          새 게임
        </button>
      </div>
    </div>
  );
}
