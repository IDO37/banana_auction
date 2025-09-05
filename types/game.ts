export interface Player {
  id: string;
  name: string;
  bananas: number;
  bid: number;
  isBankrupt: boolean;
}

export interface GameState {
  players: Player[];
  round: number;
  targetBananas: number;
  gamePhase: 'setup' | 'bidding' | 'results' | 'finished';
  winner: Player | null;
  auctionItem: number; // 매물 바나나 개수
}

export interface BidResult {
  firstPlace: Player;
  secondPlace: Player | null;
  firstPlaceBid: number;
  secondPlaceBid: number;
  bananasToSecond: number;
  bananasToFirst: number;
}
