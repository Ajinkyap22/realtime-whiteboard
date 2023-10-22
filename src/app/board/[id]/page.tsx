"use client";

import React from "react";

import { useBoundStore } from "@/zustand/store";
import { useSession } from "next-auth/react";

import InitModal from "@/app/board/components/InitModal";

type Props = {
  params: {
    id: string;
  };
};

const Board = ({ params }: Props) => {
  const { status } = useSession();

  const guestUser = useBoundStore((state) => state.guestUser);

  return <>{status === "unauthenticated" && !guestUser && <InitModal />}</>;
};

export default Board;
