"use client";

import React, { useEffect, useState } from "react";

import {
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import InitBoard from "@/app/board/components/InitBoard";

const InitModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);

  const toggleIsCreating = () => {
    setIsCreating(!isCreating);
  };

  const handleJoin = () => {};

  const handleCreate = () => {};

  useEffect(() => {
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="80%"
        backdropBlur="2px"
      />

      <ModalContent>
        <ModalHeader color="darkPrimary">
          {isCreating ? "Create a new board" : "Join a board"}
        </ModalHeader>

        <ModalBody pb="6">
          <InitBoard
            formLabel={isCreating ? "Board name" : "Board Link"}
            inputType={isCreating ? "text" : "url"}
            placeholder={
              isCreating ? "Enter a name for your board" : "Board link to join"
            }
            buttonText={isCreating ? "Create Board" : "Join Board"}
            alternativeButtonText={
              isCreating ? "Join Board" : "Create a new board"
            }
            handleToggle={toggleIsCreating}
            handleClick={isCreating ? handleCreate : handleJoin}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InitModal;
