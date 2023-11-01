import React from "react";

import { Spinner, HStack } from "@chakra-ui/react";

const Loading = () => {
  return (
    <HStack justifyContent="center" alignItems="center" w="full" h="full">
      <Spinner size="xl" color="darkPrimary" />
    </HStack>
  );
};

export default Loading;
