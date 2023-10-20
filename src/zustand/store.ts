import { create } from "zustand";
import { createUserSlice, UserSlice } from "@/zustand/userSlice";
import { createBoardSlice, BoardSlice } from "@/zustand/boardSlice";

export const useBoundStore = create<UserSlice & BoardSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createBoardSlice(...a),
}));
