import React, { useEffect, useState } from "react";

import { HStack, Text, Image } from "@chakra-ui/react";
import { useBoundStore } from "@/zustand/store";
import { useMutation } from "react-query";
import { updateBoard } from "@/services/boardService";
import { useSession } from "next-auth/react";

const BoardName = () => {
  const [editedBoardName, setEditedBoardName] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);
  const { data: session } = useSession();

  const updateBoardMutation = useMutation(
    ({
      boardId,
      boardName,
      boardData,
    }: {
      boardId: string;
      boardName: string;
      boardData: string;
    }) => updateBoard(boardId, boardName, boardData)
  );

  const board = useBoundStore((state) => state.board);
  const setBoard = useBoundStore((state) => state.setBoard);

  const handleNameChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    setEditedBoardName(e.target.innerText);
  };

  const handleUpdateName = () => {
    if (editedBoardName && editedBoardName !== board?.boardName) {
      updateBoardMutation.mutate(
        {
          boardId: board?.boardId as string,
          boardName: editedBoardName as string,
          boardData: board?.boardData as string,
        },
        {
          onSuccess: () => {
            setBoard({
              ...board,
              boardName: editedBoardName,
            });
          },
        }
      );
    }

    setEditedBoardName("");
  };

  useEffect(() => {
    if (!board?.boardName)
      setBoard({
        ...board,
        boardName: "Untitled",
      });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (editedBoardName) {
        handleUpdateName();
      } else {
        e.currentTarget.innerText = board?.boardName ?? "Untitled";
      }

      e.currentTarget.blur();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (editedBoardName) {
      handleUpdateName();
    } else {
      e.currentTarget.innerText = board?.boardName ?? "Untitled";
    }
  };

  useEffect(() => {
    if (board && board.host) {
      setIsHost(board.host === session?.user?.email);
    }
  }, [board?.host]);

  return (
    <HStack>
      {isHost && <Image src="/icons/edit.svg" alt="edit" w="4" h="4" />}

      <Text
        fontSize="sm"
        color="darkPrimary"
        border="1px solid transparent"
        p="1.5"
        borderRadius="md"
        maxW="200px"
        whiteSpace="nowrap"
        overflow="auto"
        _hover={{
          border: isHost ? "1px solid #E2E8F0" : "1px solid transparent",
          bg: isHost ? "gray.50" : "transparent",
        }}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        onInput={handleNameChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        contentEditable={isHost}
        suppressContentEditableWarning
        isTruncated
      >
        {board?.boardName ?? "Untitled"}
      </Text>
    </HStack>
  );
};

export default BoardName;
