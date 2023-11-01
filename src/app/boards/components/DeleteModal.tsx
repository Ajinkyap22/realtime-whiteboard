import React from "react";

import {
  Button,
  Text,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  HStack,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  handleDeleteBoard: () => void;
};

const DeleteModal = ({
  isOpen,
  isDeleting,
  onClose,
  handleDeleteBoard,
}: Props) => {
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
          <Text>Delete Board</Text>
        </ModalHeader>

        <ModalBody pb="6" as={VStack} gap="6">
          <Text>Are you sure you want to delete this board?</Text>

          <HStack w="full" gap="4" justifyContent="center">
            <Button
              isLoading={isDeleting}
              onClick={handleDeleteBoard}
              colorScheme="red"
            >
              Delete
            </Button>

            <Button onClick={onClose}>Cancel</Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
