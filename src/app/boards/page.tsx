"use client";

import { deleteBoard, getMyBoards } from "@/services/boardService";
import { Board } from "@/types/Board";
import {
  Button,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "@/app/loading";

type Props = {};

const Boards = (props: Props) => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const toast = useToast();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery("boards", () =>
    getMyBoards(session?.user?.email as string)
  );

  const { isLoading: isDeleting, mutate: deleteBoardMutation } = useMutation(
    ({ boardId, user }: { boardId: string; user: string }) =>
      deleteBoard(boardId, user)
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  const handleDeleteBoard = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    deleteBoardMutation(
      {
        boardId,
        user: session?.user?.email as string,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("boards");
          toast({
            title: "Board deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <>
      <Button>Create board</Button>
      <Text fontSize="3xl" p="3" color="darkPrimary">
        My Boards
      </Text>
      {isLoading && <Loading />}
      <VStack p="3">
        {data?.map((board: Board) => (
          <HStack
            onClick={() => router.push(`/board/${board.boardId}`)}
            key={board.boardId}
            p="4"
            px="6"
            border="2px"
            borderColor="darkPrimary"
            borderRadius="lg"
            cursor="pointer"
            w="full"
            justifyContent="space-between"
          >
            <Text>{board.boardName}</Text>
            <Button
              colorScheme="red"
              onClick={(e) => handleDeleteBoard(e, board.boardId as string)}
            >
              {isDeleting ? (
                <Loading />
              ) : (
                <Image src="/icons/delete.svg" alt="Delete" w="4" h="4" />
              )}
            </Button>
          </HStack>
        ))}
      </VStack>
      {data?.length === 0 && (
        <Text fontSize="lg" p="3" color="darkPrimary">
          No boards found
        </Text>
      )}
      <Text fontSize="3xl" p="3" color="darkPrimary">
        Joined Boards
      </Text>
    </>
  );
};

export default Boards;
