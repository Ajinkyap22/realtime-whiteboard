"use client";

import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { getJoinedBoards, getMyBoards } from "@/services/boardService";

import { Board } from "@/types/Board";

import {
  Text,
  VStack,
  SimpleGrid,
  useDisclosure,
  GridItem,
} from "@chakra-ui/react";

import { useQuery } from "react-query";

import Loading from "@/app/loading";
import Navbar from "@/app/boards/components/Navbar";
import BoardCard from "@/app/boards/components/BoardCard";
import CreateBoardCard from "@/app/boards/components/CreateBoardCard";
import CreateModal from "@/app/boards/components/CreateModal";

const Boards = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: boards, isLoading } = useQuery("boards", () =>
    getMyBoards(session?.user?.email as string)
  );

  const { data: joinedBoards, isLoading: loadingJoinedBoards } = useQuery(
    "joinedBoards",
    () => getJoinedBoards(session?.user?.email as string)
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <VStack
      minH="full"
      w="full"
      position="relative"
      alignItems="flex-start"
      px="4"
      className="graph-bg"
    >
      <Navbar />

      <Text fontSize="2xl" p="3" color="darkPrimary" textAlign="start">
        My Boards
      </Text>

      {isLoading ? (
        <Loading />
      ) : (
        <SimpleGrid
          p="3"
          w="full"
          templateColumns="repeat(auto-fill, minmax(225px, 1fr))"
          gap="6"
        >
          <CreateBoardCard handleCreate={onOpen} />

          {boards?.map((board: Board) => (
            <BoardCard
              type="userBoard"
              key={board.boardId!}
              boardId={board.boardId!}
              boardName={board.boardName!}
              remainingParticipants={board.remainingCount!}
              singleParticipantName={board.oneParticipantName}
            />
          ))}
        </SimpleGrid>
      )}

      <Text fontSize="2xl" p="3" color="darkPrimary">
        Joined Boards
      </Text>

      {loadingJoinedBoards ? (
        <Loading />
      ) : (
        <SimpleGrid
          p="3"
          w="full"
          templateColumns="repeat(auto-fill, minmax(225px, 1fr))"
          gap="6"
        >
          {joinedBoards?.length ? (
            joinedBoards?.map((board: Board) => (
              <BoardCard
                type="joinedBoard"
                key={board.boardId!}
                boardId={board.boardId!}
                boardName={board.boardName!}
                host={board?.hostID?.name}
              />
            ))
          ) : (
            <GridItem as={Text} fontSize="lg" colSpan={2}>
              You have not joined any boards yet.
            </GridItem>
          )}
        </SimpleGrid>
      )}

      {isOpen && <CreateModal isOpen={isOpen} onClose={onClose} />}
    </VStack>
  );
};

export default Boards;
