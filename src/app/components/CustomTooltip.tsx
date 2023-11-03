import React from "react";

import { PlacementWithLogical, Tooltip } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  label: string;
  placement?: PlacementWithLogical;
};

const CustomTooltip = ({ children, label, placement = "bottom" }: Props) => {
  return (
    <Tooltip
      placement={placement}
      label={label}
      bg="rgba(0,0,0,0.8)"
      borderRadius="md"
      py="0.5"
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
