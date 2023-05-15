import { TournamentStore } from "@/types";
import { create } from "zustand";

export const useTournamentStore = create<TournamentStore>()((set, _get) => ({
  tournamentId: "",
  currentSize: 0,
  status: "",
  players: [],
  winner: null,
  host: {
    id: "",
    username: "",
  },
  setTournamentId: (newId) => set({ tournamentId: newId }),
  setCurrentSize: (newSize) => set({ currentSize: newSize }),
  setStatus: (newStatus) => set({ status: newStatus }),
  setPlayers: (newPlayers) => set({ players: newPlayers }),
  setWinner: (newWinner) => set({ winner: newWinner }),
  setHost: (newHost) => set({ host: newHost }),
  clear: () =>
    set({
      tournamentId: "",
      currentSize: 0,
      status: "",
      players: [],
      winner: null,
      host: {
        id: "",
        username: "",
      },
    }),
}));
