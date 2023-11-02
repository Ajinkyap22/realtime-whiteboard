import React from "react";

import { Center, Divider as ChakraDivider } from "@chakra-ui/react";

type Props = {
  height?: string;
  color?: string;
};

const Divider = ({ height = "25px", color = "#D8D8DF" }: Props) => {
  return (
    <Center height={height}>
      <ChakraDivider orientation="vertical" borderColor={color} />
    </Center>
  );
};

export default Divider;
