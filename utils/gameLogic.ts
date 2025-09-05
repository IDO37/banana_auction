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
  
  const firstPlaceBid = sortedPlayers[0].bid;
  const secondPlaceBid = sortedPlayers[1]?.bid || 0;
  
  // 공동 1등, 2등 플레이어들 찾기
  const firstPlacePlayers = sortedPlayers.filter(p => p.bid === firstPlaceBid);
  const secondPlacePlayers = sortedPlayers.filter(p => p.bid === secondPlaceBid && p.bid > 0);
  
  // 1등이 2등에게 줄 바나나 개수 (총합)
  const totalBananasToSecond = (firstPlaceBid - secondPlaceBid) * secondPlacePlayers.length;
  
  // 1등이 가져갈 바나나 개수 (총합)
  const totalBananasToFirst = auctionItem - totalBananasToSecond;
  
  // 1등 플레이어가 받는 바나나 개수 (각자)
  const bananasToFirstPerPlayer = Math.floor(totalBananasToFirst / firstPlacePlayers.length);
  
  // 2등 플레이어가 받는 바나나 개수 (각자)
  const bananasToSecondPerPlayer = secondPlacePlayers.length > 0 ? 
    Math.floor((firstPlaceBid - secondPlaceBid) / secondPlacePlayers.length) : 0;
  
  return {
    firstPlace: firstPlacePlayers[0], // 대표 1등 (표시용)
    secondPlace: secondPlacePlayers[0] || null, // 대표 2등 (표시용)
    firstPlaceBid,
    secondPlaceBid,
    bananasToSecond: bananasToSecondPerPlayer,
    bananasToFirst: bananasToFirstPerPlayer,
    firstPlacePlayers, // 공동 1등 플레이어들
    secondPlacePlayers // 공동 2등 플레이어들
  };
};

export const updatePlayerBananas = (players: Player[], result: BidResult, currentRound: number): Player[] => {
  return players.map(player => {
    let newBananas = player.bananas;
    
    // 공동 1등 플레이어들 처리
    if (result.firstPlacePlayers.some(p => p.id === player.id)) {
      // 1등 플레이어: 계산된 바나나 개수만큼 획득
      newBananas = player.bananas + result.bananasToFirst;
      
      // 파산 처리 (음수일 때만 파산 처리, 0은 정상)
      if (newBananas < 0) {
        newBananas = 0;
        return { ...player, bananas: newBananas, isBankrupt: true, bankruptRound: currentRound };
      }
    } 
    // 공동 2등 플레이어들 처리
    else if (result.secondPlacePlayers.some(p => p.id === player.id)) {
      // 2등 플레이어: 계산된 바나나 개수만큼 획득
      newBananas = player.bananas + result.bananasToSecond;
    }
    
    return { ...player, bananas: newBananas };
  });
};

export const recalculateAuctionAfterBankruptcy = (players: Player[], originalResult: BidResult, currentRound: number): { players: Player[], result: BidResult } => {
  // 공동 1등 중 파산한 플레이어가 있는지 확인
  const bankruptFirstPlacePlayers = players.filter(p => 
    originalResult.firstPlacePlayers.some(fp => fp.id === p.id) && p.isBankrupt
  );
  
  if (bankruptFirstPlacePlayers.length === 0) {
    return { players, result: originalResult };
  }

  // 파산한 1등을 제외한 플레이어들로 새로운 경매 진행
  const activePlayers = players.filter(p => p.bid > 0 && !(p.isBankrupt && p.bankruptRound === currentRound));
  
  if (activePlayers.length < 2) {
    return { players, result: originalResult };
  }

  // 새로운 경매 결과 계산
  const newResult = processBids(activePlayers, originalResult.bananasToFirst, currentRound);
  
  // 새로운 결과로 플레이어 바나나 업데이트
  const updatedPlayers = updatePlayerBananas(players, newResult, currentRound);

  return { players: updatedPlayers, result: newResult };
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
