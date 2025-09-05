import { Player, GameState, BidResult } from '@/types/game';

export const calculateAuctionItem = (players: Player[]): number => {
  return Math.max(...players.map(p => p.bananas));
};

export const processBids = (players: Player[], auctionItem: number): BidResult => {
  // 호가가 0이 아닌 플레이어들만 필터링
  const activePlayers = players.filter(p => p.bid > 0);
  
  if (activePlayers.length === 0) {
    throw new Error('입찰한 플레이어가 없습니다.');
  }

  // 호가 순으로 정렬
  const sortedPlayers = [...activePlayers].sort((a, b) => b.bid - a.bid);
  
  const firstPlace = sortedPlayers[0];
  const secondPlace = sortedPlayers[1] || null;
  
  const firstPlaceBid = firstPlace.bid;
  const secondPlaceBid = secondPlace?.bid || 0;
  
  // 1등이 2등에게 줄 바나나 개수
  const bananasToSecond = firstPlaceBid - secondPlaceBid;
  
  // 1등이 가져갈 바나나 개수
  const bananasToFirst = auctionItem - bananasToSecond;
  
  return {
    firstPlace,
    secondPlace,
    firstPlaceBid,
    secondPlaceBid,
    bananasToSecond,
    bananasToFirst
  };
};

export const updatePlayerBananas = (players: Player[], result: BidResult): Player[] => {
  return players.map(player => {
    let newBananas = player.bananas;
    
    if (player.id === result.firstPlace.id) {
      // 1등 플레이어
      newBananas = player.bananas - result.bananasToSecond + result.bananasToFirst;
      
      // 파산 처리
      if (newBananas < 0) {
        newBananas = 0;
        return { ...player, bananas: newBananas, isBankrupt: true };
      }
    } else if (result.secondPlace && player.id === result.secondPlace.id) {
      // 2등 플레이어
      newBananas = player.bananas + result.bananasToSecond;
    }
    
    return { ...player, bananas: newBananas };
  });
};

export const checkWinner = (players: Player[], targetBananas: number): Player | null => {
  return players.find(player => player.bananas >= targetBananas) || null;
};

export const createInitialPlayers = (playerCount: number): Player[] => {
  return Array.from({ length: playerCount }, (_, index) => ({
    id: `player-${index + 1}`,
    name: `플레이어 ${index + 1}`,
    bananas: 10,
    bid: 0,
    isBankrupt: false
  }));
};
