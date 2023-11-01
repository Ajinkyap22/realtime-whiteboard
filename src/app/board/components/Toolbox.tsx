import React from "react";

import { ActiveTool } from "@/types/ActiveTool";

import { VStack, Image, Button } from "@chakra-ui/react";

type Props = {
  switchActiveTool: (tool: ActiveTool) => void;
  setSelection: (selection: boolean) => void;
};

const Toolbox = ({ switchActiveTool, setSelection }: Props) => {
  return (
    <VStack h="full" justifyContent="center">
      <VStack
        bg="white"
        shadow="all-around"
        mx="4"
        borderRadius="md"
        zIndex={1}
      >
        <Button
          onClick={() => setSelection(true)}
          py="5"
          px="4"
          bg="transparent"
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/select.svg" alt="select" w="6" h="6" />
        </Button>
        <Button
          onClick={() => switchActiveTool(ActiveTool.BRUSH)}
          py="5"
          px="4"
          bg="transparent"
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/marker.svg" alt="marker" w="6" h="6" />
        </Button>

        <Button
          onClick={() => switchActiveTool(ActiveTool.TEXT)}
          py="5"
          px="4"
          bg="transparent"
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/text-icon.svg" alt="text-icon" w="6" h="6" />
        </Button>
      </VStack>
    </VStack>
  );
};

export default Toolbox;
