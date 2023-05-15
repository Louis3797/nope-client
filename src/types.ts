export interface User {
  username: string;
  id: string;
}

export type Player = User;

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ token: string }>;
  signUp: (
    username: string,
    firstname: string,
    lastname: string,
    password: string
  ) => Promise<boolean>;
}

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  gamesWon: string;
  gamesPlayed: string;
}

export interface AvailableTournamentData {
  players: {
    username: string;
  }[];
  id: string;
  status: "WAITING_FOR_MORE_PLAYERS" | "FULL" | "IN_PROGRESS" | "FINISHED";
  createdAt: Date;
  currentSize: number;
}

export interface TournamentInfoPayload {
  message: string;
  tournamentId: string;
  currentSize: number;
  status: string;
  players: Array<{
    id: string;
    username: string;
    score: number; // won matches
  }>;

  winner: {
    id: string;
    username: string;
    score: number;
  } | null;
  host: {
    id: string;
    username: string;
  };
}

export interface MatchInviteData {
  message: string;
  matchId: string;
  players: Array<{ id: string; username: string }>;
  invitationTimeout: number; // time when the invitation ends. Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
}

export interface MatchInviteCallBack {
  cb: (data: { accepted: boolean; id: string }) => void;
}

export type TournamentStatus =
  | "WAITING_FOR_MORE_PLAYERS"
  | "IN_PROGRESS"
  | "FINISHED";

export type TournamentStore = Omit<TournamentInfoPayload, "message"> & {
  setTournamentId: (newId: string) => void;
  setCurrentSize: (newSize: number) => void;
  setStatus: (newStatus: TournamentStatus) => void;
  setPlayers: (
    newPlayers: Array<{
      id: string;
      username: string;
      score: number;
    }>
  ) => void;
  setWinner: (
    newWinner: {
      id: string;
      username: string;
      score: number;
    } | null
  ) => void;
  setHost: (newHost: { id: string; username: string }) => void;
  clear: () => void;
};

export interface SocketCallback<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
  } | null;
}

export interface MatchInfoPayload {
  message: string;
  tournamentId: string;
  match: {
    id: string;
    round: number;
    bestOf: number;
    status: "PENDING" | "IN_PROGRESS" | "FINISHED";
    opponents: Array<Pick<Player, "id" | "username"> & { points: number }>;
    winner: (Pick<Player, "id" | "username"> & { points: number }) | null;
  } | null;
}

export interface GameStatePayload {
  matchId: string;
  gameId: string;
  topCard: ICard;
  lastTopCard: ICard | null; // card under top card
  drawPileSize: number;
  players: Array<{
    username: string;
    id: string;
    handSize: number;
  }>;

  hand: ICard[];
  handSize: number;
  currentPlayer: {
    username: string;
    id: string;
  };
  currentPlayerIdx: number;
  prevPlayer: {
    username: string;
    id: string;
  };
  prevPlayerIdx: number | null;
  prevTurnCards: ICard[]; // last placed card
  lastMove: Move | null;
}

export default interface ICard {
  type: "number" | "joker" | "reboot" | "see-through" | "selection";
  color:
    | "red"
    | "blue"
    | "green"
    | "yellow"
    | "red-yellow"
    | "blue-green"
    | "yellow-blue"
    | "red-blue"
    | "red-green"
    | "yellow-green"
    | "multi"
    | null; // null for action cards or joker
  value: number | null; // null for action cards or joker
  select?: number | null; // is only not null if the selection card is played
  selectValue?: number | null;
  selectedColor?: "red" | "blue" | "green" | "yellow" | null;
}

export interface Move {
  type: "take" | "put" | "nope";
  card1: ICard | null;
  card2: ICard | null;
  card3: ICard | null;
  reason: string;
}
