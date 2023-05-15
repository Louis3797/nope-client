import { GameStatePayload } from "@/types";
import { create } from "zustand";

interface GameStateStoreProps {
  gameState: GameStatePayload | null;
  setGameState: (newState: GameStatePayload) => void;
}

export const useGameStateStore = create<GameStateStoreProps>()((set, _get) => ({
  gameState: null,
  setGameState: (newState: GameStatePayload) => set({ gameState: newState }),
}));
