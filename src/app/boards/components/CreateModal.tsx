import React, { useState } from "react";

import {
  Button,
  Text,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import uniqid from "uniqid";

import { createBoard, saveBoardIdTracker } from "@/services/boardService";
import { useBoundStore } from "@/zustand/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateModal = ({ isOpen, onClose }: Props) => {
  const [boardName, setBoardName] = useState("Untitled");

  const { status, data: session } = useSession();
  const router = useRouter();

  const setBoard = useBoundStore((state) => state.setBoard);

  const createBoardMutation = useMutation(
    ({ id, name, user }: { id: string; name: string; user: string }) =>
      createBoard(id, name, user)
  );

  const saveBoardIdTrackerMutation = useMutation(
    ({ boardId, hostType }: { boardId: string; hostType: string }) =>
      saveBoardIdTracker(boardId, hostType)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
  };

  const handleCreateBoard = async () => {
    const id = uniqid();

    const board = {
      name: boardName,
      id,
    };

    setBoard(board);

    saveBoardIdTrackerMutation.mutate({
      boardId: id,
      hostType: "user",
    });

    createBoardMutation.mutate({
      id,
      name: boardName.trim(),
      user: session?.user?.email as string,
    });

    router.push(`/board/${id}`);
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateBoard();
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="80%"
        backdropBlur="2px"
      />

      <ModalContent>
        <ModalHeader color="darkPrimary" textAlign="center">
          <Text>Create a new board</Text>

          <ModalCloseButton alignItems="center" />
        </ModalHeader>

        <ModalBody pb="6" as={VStack} gap="6">
          <FormControl isRequired>
            <FormLabel color="darkPrimary">What should we call it?</FormLabel>

            <Input
              value={boardName}
              type="text"
              placeholder="e.g. My new board"
              onChange={handleInputChange}
              onKeyDown={handleKeydown}
            />
          </FormControl>

          <Button
            isDisabled={!boardName.trim()}
            onClick={handleCreateBoard}
            w="full"
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
            Let&#39;s go!
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
