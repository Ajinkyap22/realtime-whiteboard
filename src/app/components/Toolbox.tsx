import { VStack, HStack, Text, Image, Button } from "@chakra-ui/react";
import React from "react";

type Props = {};

const Toolbox = (props: Props) => {
  return (
    <VStack h="full" justifyContent="center">
      <VStack
        bg="white"
        shadow="all-around"
        mx="4"
        px="3"
        py="1.5"
        borderRadius="md"
        gap="4"
        zIndex={1}
      >
        <Button
          py="5"
          px="4"
          bg="transparent"
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/marker.svg" alt="marker" w="7" h="7" />
        </Button>
        <Button
          py="5"
          px="4"
          bg="transparent"
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/text-icon.svg" alt="text-icon" w="7" h="7" />
        </Button>
      </VStack>
    </VStack>
  );
};

export default Toolbox;
