import React from "react";
import dynamic from "next/dynamic";

import {
  Button,
  Card,
  GridItem,
  Text,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  HStack,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";
import { deleteBoard } from "@/services/boardService";
import { useSession } from "next-auth/react";

import { useBoundStore } from "@/zustand/store";

const DeleteModal = dynamic(
  () => import("@/app/boards/components/DeleteModal"),
  {
    ssr: false,
  }
);

type Props = {
  type: "userBoard" | "joinedBoard";
  boardId: string;
  boardName: string;
  remainingParticipants?: number | null;
  singleParticipantName?: string | null | undefined;
  host?: string;
};

const BoardCard = ({
  type,
  boardId,
  boardName,
  remainingParticipants,
  singleParticipantName,
  host,
}: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const setBoard = useBoundStore((state) => state.setBoard);

  const { isLoading: isDeleting, mutate: deleteBoardMutation } = useMutation(
    ({ boardId, user }: { boardId: string; user: string }) =>
      deleteBoard(boardId, user)
  );

  const handleView = () => {
    setBoard({
      boardId,
      boardName,
    });

    router.push(`/board/${boardId}`);
  };

  const handleDeleteBoard = () => {
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
          onClose();
        },
      }
    );
  };

  return (
    <GridItem as={Card}>
      <CardHeader>
        <Heading size="md">{boardName}</Heading>
      </CardHeader>

      <CardBody>
        {type === "userBoard" && (
          <Text>
            {remainingParticipants === null
              ? "No participants"
              : remainingParticipants === 0
              ? `${singleParticipantName} is a participant`
              : `${singleParticipantName} & ${remainingParticipants} other participants`}
          </Text>
        )}

        {type === "joinedBoard" && host && <Text>Host: {host}</Text>}
      </CardBody>

      <CardFooter as={HStack} gap="3">
        <Button
          bg="darkPrimary"
          color="white"
          onClick={handleView}
          _hover={{
            bg: "darkPrimary",
            color: "white",
          }}
        >
          View board
        </Button>

        {type === "userBoard" && <Button onClick={onOpen}>Delete</Button>}
      </CardFooter>

      {isOpen && (
        <DeleteModal
          isOpen={isOpen}
          onClose={onClose}
          handleDeleteBoard={handleDeleteBoard}
          isDeleting={isDeleting}
        />
      )}
    </GridItem>
  );
};

export default BoardCard;
