import React from "react";

import { SpaceMember } from "@ably/spaces";

import { HStack, AvatarGroup, Avatar } from "@chakra-ui/react";

type Props = {
  members: SpaceMember[];
};

const AvatarStack = ({ members }: Props) => {
  return (
    <AvatarGroup max={6}>
      {members.map((member) => (
        <Avatar
          key={member.clientId}
          name={member?.profileData?.name as string}
          src={member?.profileData?.avatar as string}
          size="sm"
        />
      ))}
    </AvatarGroup>
  );
};

export default AvatarStack;
