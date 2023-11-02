import React, { useState } from "react";

import { HStack, Text, Image } from "@chakra-ui/react";
import { useBoundStore } from "@/zustand/store";

const BoardName = () => {
  const [editedBoardName, setEditedBoardName] = useState<string>("");

  const board = useBoundStore((state) => state.board);
  const setBoard = useBoundStore((state) => state.setBoard);

  const handleNameChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    setEditedBoardName(e.target.innerText);
  };

  const handleUpdateName = () => {
    if (editedBoardName && editedBoardName !== board?.boardName) {
      setBoard({
        ...board,
        name: editedBoardName,
      });
    }

    setEditedBoardName("");
  };

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

  return (
    <HStack>
      <Image src="/icons/edit.svg" alt="edit" w="4" h="4" />
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
          border: "1px solid #E2E8F0",
          bg: "gray.50",
        }}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        onInput={handleNameChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        contentEditable
        suppressContentEditableWarning
        isTruncated
      >
        {board?.boardName ?? "Untitled"}
      </Text>
    </HStack>
  );
};

export default BoardName;
