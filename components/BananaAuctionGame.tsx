'use client';

import { useState, useEffect } from 'react';
import { Player, GameState, BidResult } from '@/types/game';
import { 
  createInitialPlayers, 
  calculateAuctionItem, 
  processBids, 
  updatePlayerBananas, 
  recalculateAuctionAfterBankruptcy,
  checkWinner 
} from '@/utils/gameLogic';
import GameSetup from './GameSetup';
import PlayerBidding from './PlayerBidding';
import AuctionResults from './AuctionResults';
import GameFinished from './GameFinished';

export default function BananaAuctionGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    round: 0,
    targetBananas: 200,
    gamePhase: 'setup',
    winner: null,
    auctionItem: 0
  });

  const [lastBidResult, setLastBidResult] = useState<BidResult | null>(null);

  const startGame = (playerCount: number, targetBananas: number) => {
    const players = createInitialPlayers(playerCount);
    const auctionItem = calculateAuctionItem(players);
    
    setGameState({
      players,
      round: 1,
      targetBananas,
      gamePhase: 'bidding',
      winner: null,
      auctionItem
    });
    setLastBidResult(null);
  };

  const handleBidChange = (playerId: string, bid: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId ? { ...player, bid } : player
      )
    }));
  };

  const handleNameChange = (playerId: string, name: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId ? { ...player, name: name.trim() || `플레이어 ${player.id.split('-')[1]}` } : player
      )
    }));
  };

  const startAuction = () => {
    try {
      const result = processBids(gameState.players, gameState.auctionItem, gameState.round);
      let updatedPlayers = updatePlayerBananas(gameState.players, result, gameState.round);
      
      // 1등이 파산한 경우 새로운 1등, 2등을 정하고 재계산
      const { players: finalPlayers, result: finalResult } = recalculateAuctionAfterBankruptcy(updatedPlayers, result, gameState.round);
      updatedPlayers = finalPlayers;
      
      const winner = checkWinner(updatedPlayers, gameState.targetBananas);
      
      setLastBidResult(finalResult);
      
      if (winner) {
        setGameState(prev => ({
          ...prev,
          players: updatedPlayers,
          gamePhase: 'finished',
          winner
        }));
      } else {
        // 다음 라운드 준비
        const newAuctionItem = calculateAuctionItem(updatedPlayers);
        
        // 모든 플레이어가 파산한 경우 게임 종료
        if (newAuctionItem === 0) {
          const bankruptWinner = updatedPlayers.find(p => p.bananas > 0) || updatedPlayers[0];
          setGameState(prev => ({
            ...prev,
            players: updatedPlayers,
            gamePhase: 'finished',
            winner: bankruptWinner
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            players: updatedPlayers.map(p => ({ ...p, bid: 0 })),
            round: prev.round + 1,
            auctionItem: newAuctionItem,
            gamePhase: 'results'
          }));
        }
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '경매 처리 중 오류가 발생했습니다.');
    }
  };

  const nextRound = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'bidding'
    }));
    setLastBidResult(null);
  };

  const newGame = () => {
    setGameState({
      players: [],
      round: 0,
      targetBananas: 200,
      gamePhase: 'setup',
      winner: null,
      auctionItem: 0
    });
    setLastBidResult(null);
  };

  const canStartAuction = gameState.players.some(player => 
    player.bid > 0 && !(player.isBankrupt && player.bankruptRound === gameState.round)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-banana-50 to-banana-100 py-8">
      <div className="container mx-auto px-4">
        {gameState.gamePhase === 'setup' && (
          <GameSetup onStartGame={startGame} />
        )}

        {gameState.gamePhase === 'bidding' && (
          <PlayerBidding
            players={gameState.players}
            onBidChange={handleBidChange}
            onNameChange={handleNameChange}
            onStartAuction={startAuction}
            auctionItem={gameState.auctionItem}
            canStartAuction={canStartAuction}
            round={gameState.round}
          />
        )}

        {gameState.gamePhase === 'results' && lastBidResult && (
          <AuctionResults
            players={gameState.players}
            result={lastBidResult}
            auctionItem={gameState.auctionItem}
            onNextRound={nextRound}
            onNewGame={newGame}
          />
        )}

        {gameState.gamePhase === 'finished' && gameState.winner && (
          <GameFinished
            winner={gameState.winner}
            players={gameState.players}
            targetBananas={gameState.targetBananas}
            onNewGame={newGame}
          />
        )}

        {/* 게임 정보 표시 */}
        {gameState.gamePhase !== 'setup' && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-lg shadow-md px-6 py-3">
              <div>
                <span className="text-sm text-gray-600">라운드</span>
                <p className="font-bold text-lg">{gameState.round}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">목표</span>
                <p className="font-bold text-lg text-banana-600">{gameState.targetBananas}개</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">매물</span>
                <p className="font-bold text-lg text-banana-600">{gameState.auctionItem}개</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
