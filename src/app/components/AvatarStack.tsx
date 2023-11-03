import React from "react";

import { SpaceMember } from "@ably/spaces";

import { AvatarGroup, Avatar } from "@chakra-ui/react";
import CustomTooltip from "./CustomTooltip";

type Props = {
  members: SpaceMember[];
};

const AvatarStack = ({ members }: Props) => {
  return (
    <AvatarGroup max={3} size="sm">
      {members.map((member) => (
        <CustomTooltip
          key={member?.clientId}
          label={member?.profileData?.name as string}
        >
          <Avatar
            name={member?.profileData?.name as string}
            src={member?.profileData?.avatar as string}
            size="sm"
          />
        </CustomTooltip>
      ))}
    </AvatarGroup>
  );
};

export default AvatarStack;
