"use client";

import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { VStack, Text, Image, HStack, Box } from "@chakra-ui/react";

import OnboardingCard from "@/app/components/OnboardingCard";

import uniqid from "uniqid";
import { useMutation } from "react-query";
import { useBoundStore } from "@/zustand/store";

import {
  createBoard,
  doesUserHaveBoards,
  saveBoardIdTracker,
} from "@/services/boardService";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const setBoard = useBoundStore((state) => state.setBoard);

  const { status, data: session } = useSession();

  const doesUserHaveBoardsMutation = useMutation(({ user }: { user: string }) =>
    doesUserHaveBoards(user)
  );

  const createBoardMutation = useMutation(
    ({ id, name, user }: { id: string; name: string; user: string }) =>
      createBoard(id, name, user)
  );

  const saveBoardIdTrackerMutation = useMutation(
    ({ boardId, hostType }: { boardId: string; hostType: string }) =>
      saveBoardIdTracker(boardId, hostType)
  );

  const handleCreateBoard = async () => {
    const isAuthenticated = status === "authenticated";

    const userHasBoards =
      isAuthenticated &&
      (await doesUserHaveBoardsMutation.mutateAsync({
        user: session?.user?.email as string,
      }));

    if (userHasBoards) {
      router.push("/boards");
      return;
    }

    const id = uniqid();

    const board = {
      name: "Untitled",
      id,
    };

    setBoard(board);

    saveBoardIdTrackerMutation.mutate({
      boardId: id,
      hostType: isAuthenticated ? "user" : "guest",
    });

    if (isAuthenticated) {
      createBoardMutation.mutate({
        id,
        name: board.name,
        user: session?.user?.email as string,
      });
    }

    router.push(`/board/${id}`);
  };

  useEffect(() => {
    if (status === "authenticated") {
      // TODO: after integrating with backend, check if user has any boards if not then create a new board and redirect to it
      handleCreateBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (pathname === "/boards") {
      router.replace("/");
    }
  }, [pathname, router]);

  useEffect(() => {
    // prefetch /boards page
    router.prefetch("/boards");
  }, [router]);

  return (
    <VStack
      minH="full"
      w="full"
      justifyContent="flex-start"
      alignItems="space-between"
      className="graph-bg"
    >
      <VStack
        py={{
          base: "10",
          md: "28",
        }}
        gap={{
          base: "10",
          md: "20",
        }}
      >
        <VStack gap="4" px="4">
          {/* title */}
          <HStack gap="4">
            <Image src="/icons/logo.svg" alt="Syncboard" w="12" h="12" />
            <Text fontSize="2xl" color="darkPrimary">
              Syncboard
            </Text>
          </HStack>

          {/* subtitle */}
          <Text fontSize="lg" color="darkPrimary" textAlign="center">
            The real-time whiteboard that keeps everyone in sync
          </Text>
        </VStack>

        <Box
          gap={{
            base: "2",
            md: "6",
          }}
          px="4"
          display="flex"
          flexDirection={{
            base: "column",
            md: "row",
          }}
          justifyContent="center"
          alignItems="center"
        >
          {/* start instantly */}
          <OnboardingCard
            type="create-board"
            handleCreateBoard={handleCreateBoard}
          />

          <Text
            textAlign="center"
            color="darkPrimary"
            fontWeight="light"
            fontSize="xl"
          >
            or
          </Text>

          {/* sign in */}
          <OnboardingCard
            type="sign in"
            handleCreateBoard={handleCreateBoard}
          />
        </Box>
      </VStack>
    </VStack>
  );
}
