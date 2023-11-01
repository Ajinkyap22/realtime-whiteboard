import React, { useEffect, useState } from "react";

import { HStack, Text, Image, useToast } from "@chakra-ui/react";
import { useBoundStore } from "@/zustand/store";

type Props = {
  boardName: string;
};

const BoardName = ({ boardName }: Props) => {
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

      setEditedBoardName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleUpdateName();
      e.currentTarget.blur();
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
        onBlur={handleUpdateName}
        onKeyDown={handleKeyDown}
        contentEditable
        suppressContentEditableWarning
      >
        {boardName}
      </Text>
    </HStack>
  );
};

export default BoardName;
