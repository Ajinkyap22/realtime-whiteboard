import { StateCreator } from "zustand";
import { User } from "@/types/User";

export type UserSlice = {
  user: User | null;
  guestUser: string | null;
  clientId: string | null;
  setUser: (user: User) => void;
  setGuestUser: (guestUser: string | null) => void;
  setClientId: (clientId: string | null) => void;
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  guestUser: null,
  clientId: null,
  setUser: (user: User) =>
    set({
      user,
    }),
  setGuestUser: (guestUser: string | null) =>
    set({
      guestUser,
    }),
  setClientId: (clientId: string | null) => set({ clientId }),
});
