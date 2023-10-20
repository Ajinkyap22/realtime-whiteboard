import { StateCreator } from "zustand";
import { User } from "@/types/User";

export type UserSlice = {
  user: User | null;
  guestUser: string | null;
  setUser: (user: User) => void;
  setGuestUser: (guestUser: string) => void;
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  guestUser: null,
  setUser: (user: User) =>
    set({
      user,
    }),
  setGuestUser: (guestUser: string) =>
    set({
      guestUser,
    }),
});
