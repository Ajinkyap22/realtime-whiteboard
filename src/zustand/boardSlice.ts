import { StateCreator } from "zustand";
import { Board } from "@/types/Board";

export type BoardSlice = {
  board: Board | null;
  setBoard: (board: Board) => void;
};

export const createBoardSlice: StateCreator<BoardSlice> = (set) => ({
  board: null,
  setBoard: (board: Board) => set({ board }),
});