import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUserSlice, UserSlice } from "@/zustand/userSlice";
import { createBoardSlice, BoardSlice } from "@/zustand/boardSlice";

export const useBoundStore = create<UserSlice & BoardSlice>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createBoardSlice(...a),
    }),
    {
      name: "guest-user-storage",
      partialize: (state) => ({
        guestUser: state.guestUser,
        clientId: state.clientId,
      }),
    }
  )
);
