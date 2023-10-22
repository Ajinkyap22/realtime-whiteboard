"use client";

import React, { useEffect } from "react";

import {
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { useBoundStore } from "@/zustand/store";

import InitBoard from "@/app/board/components/InitBoard";

const InitModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const setGuestUser = useBoundStore((state) => state.setGuestUser);

  const handleCreateGuestUser = (guestUserName: string) => {
    setGuestUser(guestUserName);
    onClose();
  };

  useEffect(() => {
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      // closeOnOverlayClick={false} TODO: uncomment this when handleCreateGuestUser is implemented
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="80%"
        backdropBlur="2px"
      />

      <ModalContent>
        <ModalHeader color="darkPrimary">
          Tell us a little about yourself
        </ModalHeader>

        <ModalBody pb="6">
          <InitBoard handleSave={handleCreateGuestUser} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InitModal;
