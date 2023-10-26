"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useBoundStore } from "@/zustand/store";
import { useSession } from "next-auth/react";

import InitModal from "@/app/board/components/InitModal";
import { subscribeTheUser, unsubscribeTheUser } from "@/app/config/ably";
import type { MembersLocation } from "@/app/types/MembersLocation";
import type { UserEvent } from "@/app/types/UserEvent";
import { AblySpaceEventIdentifiers } from "@/app/types/AblySpaceEventIdentifiers";

import uniqid from "uniqid";
import { Avatar, AvatarGroup, Box, Image, useToast } from "@chakra-ui/react";
import { CursorUpdate, ProfileData, SpaceMember } from "@ably/spaces";

type Props = {
  params: {
    id: string;
  };
};

const Board = ({ params }: Props) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [membersLocation, setMembersLocation] = useState<MembersLocation[]>([]);
  const { data: session, status } = useSession();
  const guestUser = useBoundStore((state) => state.guestUser);

  const clientId = useMemo(() => {
    return session?.user?.email
      ? session?.user?.email +
          "&" +
          session?.user?.name?.split(" ")[0] +
          "&user"
      : uniqid() + "&" + guestUser?.split(" ")[0] + "&guest";
  }, [guestUser]);

  const toast = useToast();

  const getToastTitleForUserEvent = (event: string) => {
    switch (event) {
      case AblySpaceEventIdentifiers.PRESENT:
        return "entered";
      case AblySpaceEventIdentifiers.LEAVE:
        return "left";
    }
  };

  const handleUserEvent = (message: UserEvent) => {
    const members = message.members;
    members.sort((a, b) => {
      return a.lastEvent.timestamp - b.lastEvent.timestamp;
    });
    const lastUser = members[members.length - 1];
    const eventHappened = getToastTitleForUserEvent(lastUser.lastEvent.name);

    if (eventHappened === "entered") {
      const uniqueMembers = members.filter(
        (member, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.clientId === member.clientId &&
              t.profileData?.name === member.profileData?.name
          )
      );
      setMembers(uniqueMembers);

      setMembersLocation(
        uniqueMembers.map((member) => {
          return {
            member: member,
            x: 0,
            y: 0,
          };
        })
      );
    } else if (eventHappened === "left") {
      setMembers((prevMembers) => {
        return prevMembers.filter((member) => {
          return member.clientId !== lastUser.clientId;
        });
      });

      setMembersLocation((prevMembersLocation) => {
        return prevMembersLocation.filter((memberLocation) => {
          return memberLocation.member.clientId !== lastUser.clientId;
        });
      });
    }

    toast({
      description:
        lastUser.clientId.split("&")[1] + " " + eventHappened + " the room",
      duration: 2000,
      isClosable: false,
      position: "bottom-left",
      variant: "left-accent",
    });
  };

  const handleCursorEvent = (cursorEvent: CursorUpdate) => {
    setMembersLocation((prevMembersLocation) => {
      return prevMembersLocation.map((memberLocation) => {
        if (memberLocation.member.clientId === cursorEvent.clientId) {
          return {
            ...memberLocation,
            x: cursorEvent.position.x,
            y: cursorEvent.position.y,
          };
        }

        return memberLocation;
      });
    });
  };

  const handleUnsubscribe = async () => {
    await unsubscribeTheUser(clientId, params.id);
  };

  const handleAblyConnection = async () => {
    const profileData: ProfileData = {
      name: session?.user?.name ? session?.user?.name : guestUser,
      email: session?.user?.email ? session?.user?.email : guestUser,
      avatar: session?.user?.image ? session?.user?.image : "",
    };
    const space = await subscribeTheUser(clientId, params.id, profileData);

    space.subscribe((message) => {
      console.log("userEvent", message);
      handleUserEvent(message);
    });

    space.cursors.subscribe("update", (cursorEvent) => {
      handleCursorEvent(cursorEvent);
    });

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      space.cursors.set({ position: { x: clientX, y: clientY } });
    });
  };

  const handleSaveBoard = () => {};

  useEffect(() => {
    if (status === "authenticated") {
      handleSaveBoard();
    }
    //TODO: add dependency of board data
  }, []);

  useEffect(() => {
    if (status === "authenticated" || !!guestUser) handleAblyConnection();
  }, [status, guestUser]);

  useEffect(() => {
    return () => {
      handleUnsubscribe();
    };
  }, []);

  return (
    <>
      {/* Cursor */}
      {membersLocation && membersLocation.length > 0 ? (
        <Box>
          {membersLocation.map((memberLocation) => {
            if (memberLocation.member.clientId === clientId) {
              return null;
            }

            return (
              <Box
                key={memberLocation.member.clientId}
                position="absolute"
                left={memberLocation.x + "px"}
                top={memberLocation.y + "px"}
                zIndex={1000}
              >
                <Image src="/icons/cursor.svg" alt="cursor" w="4" h="4" />
                <p>{memberLocation.member?.profileData?.name as string}</p>
              </Box>
            );
          })}
        </Box>
      ) : null}
      {/* Avatar stack */}
      {members && members.length > 0 ? (
        <AvatarGroup>
          {members.map((member) => {
            return (
              <Avatar
                key={member.clientId}
                name={member?.profileData?.name as string}
                src={member?.profileData?.avatar as string}
              />
            );
          })}
        </AvatarGroup>
      ) : null}
      {status === "unauthenticated" && !guestUser && <InitModal />}
    </>
  );
};

export default Board;
