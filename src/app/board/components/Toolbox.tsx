import React from "react";

import { ActiveTool } from "@/types/ActiveTool";

import { VStack, Image, Button, Box } from "@chakra-ui/react";
import Shape from "@/app/board/components/Shapes";
import { Shapes } from "@/types/Shapes";

type Props = {
  activeTool: ActiveTool;
  activeShape: Shapes;
  switchActiveTool: (tool: ActiveTool) => void;
  handleSwitchShape: (shape: Shapes) => void;
};

const Toolbox = ({
  activeTool,
  activeShape,
  handleSwitchShape,
  switchActiveTool,
}: Props) => {
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
          onClick={() => switchActiveTool(ActiveTool.BRUSH)}
          py="6"
          px="4"
          bg={activeTool === ActiveTool.BRUSH ? "gray.100" : "transparent"}
          _hover={{
            bg: "gray.100",
          }}
        >
          <Image src="/icons/marker.svg" alt="marker" w="6" h="6" />
        </Button>

        <Button
          onClick={() => switchActiveTool(ActiveTool.TEXT)}
          py="6"
          px="4"
          bg={activeTool === ActiveTool.TEXT ? "gray.100" : "transparent"}
          _hover={{
            bg: "gray.100",
          }}
        >
          <Image src="/icons/text-icon.svg" alt="text" w="6" h="6" />
        </Button>

        <Shape
          isActive={activeTool === ActiveTool.SHAPE}
          activeShape={activeShape}
          handleSwitchTool={() => switchActiveTool(ActiveTool.SHAPE)}
          handleSwitchShape={handleSwitchShape}
        />
        {/*         
        <Button
          onClick={() => switchActiveTool(ActiveTool.ERASER)}
          py="5"
          px="4"
          bg={activeTool === ActiveTool.ERASER ? "gray.100" : "transparent"}
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/eraser.svg" alt="eraser" w="6" h="6" />
        </Button> */}

        <Button
          onClick={() => switchActiveTool(ActiveTool.SELECT)}
          py="6"
          px="4"
          bg={activeTool === ActiveTool.SELECT ? "gray.100" : "transparent"}
          _hover={{
            bg: "gray.100",
          }}
        >
          <Image src="/icons/cursor.svg" alt="text" w="6" h="6" p="0.5" />
        </Button>
      </VStack>
    </VStack>
  );
};

export default Toolbox;
