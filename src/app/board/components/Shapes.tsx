import React from "react";

import { VStack, Image, Button, Box } from "@chakra-ui/react";
import { Shapes } from "@/types/Shapes";

type Props = {
  isActive: boolean;
  activeShape: Shapes;
  handleSwitchTool: () => void;
  handleSwitchShape: (shape: Shapes) => void;
};

const Shape = ({
  isActive,
  activeShape,
  handleSwitchTool,
  handleSwitchShape,
}: Props) => {
  return (
    <Box position="relative">
      <Button
        onClick={handleSwitchTool}
        py="6"
        px="4"
        bg={isActive ? "gray.100" : "transparent"}
        _hover={{
          bg: "gray.100",
        }}
      >
        <Image src="/icons/shapes.svg" alt="shapes" w="6" h="6" />
      </Button>

      <VStack
        position="absolute"
        top="0"
        right={-16}
        bg="white"
        shadow="all-around"
        borderRadius="md"
        zIndex={1}
      >
        {isActive &&
          Object.values(Shapes).map((shape) => (
            <Button
              onClick={() => handleSwitchShape(shape as Shapes)}
              key={shape}
              p="4"
              bg={activeShape === shape ? "gray.100" : "transparent"}
              _hover={{
                bg: "gray.100",
              }}
            >
              <Image src={`/icons/${shape}.svg`} alt="marker" w="4" h="4" />
            </Button>
          ))}
      </VStack>
    </Box>
  );
};

export default Shape;
