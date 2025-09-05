import { Player, GameState, BidResult } from '@/types/game';

export const calculateAuctionItem = (players: Player[]): number => {
  // 파산하지 않은 플레이어들 중에서 최대 바나나 개수
  const activePlayers = players.filter(p => !p.isBankrupt);
  if (activePlayers.length === 0) {
    return 0; // 모든 플레이어가 파산한 경우
  }
  return Math.max(...activePlayers.map(p => p.bananas));
};

export const processBids = (players: Player[], auctionItem: number, currentRound: number): BidResult => {
  // 호가가 0이 아니고 현재 라운드에서 파산하지 않은 플레이어들만 필터링
  const activePlayers = players.filter(p => p.bid > 0 && !(p.isBankrupt && p.bankruptRound === currentRound));
  
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
  
  // 1등이 가져갈 바나나 개수 (매물 전체)
  const bananasToFirst = auctionItem;
  
  return {
    firstPlace,
    secondPlace,
    firstPlaceBid,
    secondPlaceBid,
    bananasToSecond,
    bananasToFirst
  };
};

export const updatePlayerBananas = (players: Player[], result: BidResult, currentRound: number): Player[] => {
  return players.map(player => {
    let newBananas = player.bananas;
    
    if (player.id === result.firstPlace.id) {
      // 1등 플레이어: 매물 바나나를 가져가고 2등에게 차이만큼 지급
      newBananas = player.bananas - result.bananasToSecond + result.bananasToFirst;
      
      // 파산 처리
      if (newBananas < 0) {
        newBananas = 0;
        return { ...player, bananas: newBananas, isBankrupt: true, bankruptRound: currentRound };
      }
    } else if (result.secondPlace && player.id === result.secondPlace.id) {
      // 2등 플레이어: 1등으로부터 (1등 호가 - 2등 호가) 받음
      newBananas = player.bananas + result.bananasToSecond;
    }
    
    return { ...player, bananas: newBananas };
  });
};

export const checkWinner = (players: Player[], targetBananas: number): Player | null => {
  // 목표 바나나에 도달한 플레이어들 찾기
  const qualifiedPlayers = players.filter(player => player.bananas >= targetBananas);
  
  if (qualifiedPlayers.length === 0) {
    return null; // 목표 달성한 플레이어 없음
  }
  
  if (qualifiedPlayers.length === 1) {
    return qualifiedPlayers[0]; // 목표 달성한 플레이어가 1명
  }
  
  // 목표 달성한 플레이어가 여러 명인 경우, 가장 많은 바나나를 가진 플레이어 선택
  return qualifiedPlayers.reduce((winner, current) => 
    current.bananas > winner.bananas ? current : winner
  );
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
