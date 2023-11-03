import { StateCreator } from "zustand";
import { Board } from "@/types/Board";

export type BoardSlice = {
  board: Board | null;
  setBoard: (board: Board | null) => void;
  setBoardWithPrevious: (fn: (prevBoard: Board) => Board) => void;
};

export const createBoardSlice: StateCreator<BoardSlice> = (set) => ({
  board: null,
  setBoard: (board: Board | null) => set({ board }),
  setBoardWithPrevious: (fn: (prevBoard: Board) => Board) =>
    set((state) => ({ board: fn(state.board as Board) })),
});
