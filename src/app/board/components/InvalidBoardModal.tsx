"use client";

import React, { useEffect } from "react";

import {
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const InvalidBoardModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { status } = useSession();

  const router = useRouter();

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
        <ModalHeader color="darkPrimary">This board does not exist</ModalHeader>
        <ModalBody pb="6">
          <Button
            onClick={() =>
              router.push(status === "authenticated" ? "/boards" : "/")
            }
          >
            Go back
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InvalidBoardModal;
