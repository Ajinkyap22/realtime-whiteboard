import React from "react";

import {
  HStack,
  Button,
  Text,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useToast,
  ModalCloseButton,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ShareModal = ({ isOpen, onClose }: Props) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);

    toast({
      description: "The link has been copied to your clipboard.",
      duration: 2000,
      isClosable: false,
      position: "bottom-right",
      variant: "left-accent",
    });
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
          <Text>Share this board with others</Text>

          <ModalCloseButton alignItems="center" />
        </ModalHeader>

        <ModalBody pb="6">
          {/* copy link option */}
          <HStack
            bg="white"
            shadow="all-around"
            p="4"
            borderRadius="md"
            gap="4"
          >
            <Text fontSize="sm" color="darkPrimary">
              {window.location.href}
            </Text>

            <Button onClick={handleCopy}>
              <Text fontSize="sm">Copy link</Text>
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
