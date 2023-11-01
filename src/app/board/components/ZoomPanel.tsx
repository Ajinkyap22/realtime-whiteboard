import React, { useEffect, useState } from "react";

import { Button, HStack, Text, Image } from "@chakra-ui/react";
import Divider from "@/app/components/Divider";

type Props = {
  currentZoom: number;
  handleZoom: (type: "in" | "out") => void;
};

const ZoomPanel = ({ currentZoom, handleZoom }: Props) => {
  const [fullScreen, setFullScreen] = useState(false);

  const handleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  useEffect(() => {
    if (fullScreen) {
      document.documentElement.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullScreen]);

  return (
    <HStack
      position="fixed"
      bottom="6"
      right="6"
      bg="white"
      shadow="all-around"
      px="2"
      py="1.5"
      borderRadius="md"
      zIndex={1}
    >
      <Button
        onClick={() => handleZoom("out")}
        bg="transparent"
        fontSize="lg"
        fontWeight="normal"
        w="0"
        h="0"
        px="2"
        py="4"
      >
        <Image src="/icons/minus.svg" alt="zoom out" w="4" h="4" />
      </Button>

      <Text fontSize="sm">{Math.round(currentZoom * 100)}%</Text>

      <Button
        onClick={() => handleZoom("in")}
        bg="transparent"
        fontSize="lg"
        fontWeight="normal"
        w="0"
        h="0"
        px="2"
        py="4"
      >
        <Image src="/icons/plus.svg" alt="zoom in" w="4" h="4" />
      </Button>

      <Divider />

      <Button
        onClick={handleFullScreen}
        bg="transparent"
        fontSize="lg"
        fontWeight="normal"
        w="0"
        h="0"
        px="2"
        py="4"
      >
        <Image
          src={fullScreen ? "/icons/smallscreen.svg" : "/icons/fullscreen.svg"}
          alt="zoom in"
          w="4"
          h="4"
        />
      </Button>
    </HStack>
  );
};

export default ZoomPanel;
