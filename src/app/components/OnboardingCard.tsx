"use client";

import React, { useEffect } from "react";

import { signIn, useSession } from "next-auth/react";
import { VStack, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useBoundStore } from "@/zustand/store";

type Props = {
  type: "create-board" | "sign in";
  handleCreateBoard: () => void;
};

const OnboardingCard = ({ type, handleCreateBoard }: Props) => {
  const router = useRouter();
  const { status } = useSession();

  const guestUser = useBoundStore((state) => state.guestUser);
  const board = useBoundStore((state) => state.board);
  const setGuestUser = useBoundStore((state) => state.setGuestUser);
  const setClientId = useBoundStore((state) => state.setClientId);

  const handleSignIn = () => {
    signIn("google");
  };

  useEffect(() => {
    if (status === "unauthenticated" && !!guestUser && !!board) {
      router.push(`/board/${board.boardId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, guestUser, board]);

  useEffect(() => {
    if (status === "authenticated") {
      setGuestUser(null);
      setClientId(null);
    }
  }, [status, setGuestUser, setClientId]);

  return (
    <VStack bg="white" p="6" borderRadius="lg" boxShadow="all-around">
      <Text fontSize="3xl" color="darkPrimary">
        {type === "create-board" ? "Start Instantly" : "Sign in"}
      </Text>

      {type === "create-board" ? (
        <VStack alignItems="flex-start">
          <Text color="darkPrimary">
            - No sign up required, start brainstorming directly
          </Text>

          <Text color="darkPrimary">
            - But you won&#39;t be able to save your board
          </Text>
        </VStack>
      ) : (
        <VStack alignItems="flex-start">
          <Text color="darkPrimary">
            - Get started within seconds with your Google account
          </Text>

          <Text color="darkPrimary">
            - Save your boards and access them from anywhere
          </Text>
        </VStack>
      )}

      {type === "create-board" ? (
        <Button
          onClick={handleCreateBoard}
          mt="6"
          fontSize="lg"
          h="0"
          py="5"
          bg="white"
          border="1px"
          borderColor="darkPrimary"
          color="darkPrimary"
          fontWeight="medium"
          _hover={{
            bg: "darkPrimary",
            color: "white",
          }}
        >
          Create a board
        </Button>
      ) : (
        <Button
          onClick={handleSignIn}
          mt="6"
          fontSize="lg"
          h="0"
          py="5"
          bg="darkPrimary"
          border="1px"
          borderColor="transparent"
          color="white"
          fontWeight="medium"
          _hover={{
            bg: "darkPrimary",
            color: "white",
          }}
        >
          Sign in
        </Button>
      )}
    </VStack>
  );
};

export default OnboardingCard;
