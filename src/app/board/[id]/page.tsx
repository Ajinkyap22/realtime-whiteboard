"use client";

import React, { useEffect, useState } from "react";

import { useBoundStore } from "@/zustand/store";
import { useSession } from "next-auth/react";
import uniqid from "uniqid";
import { Box, VStack, useToast } from "@chakra-ui/react";
import { CursorUpdate, ProfileData, SpaceMember } from "@ably/spaces";
import { useMutation } from "react-query";

import InitModal from "@/app/board/components/InitModal";
import Cursor from "@/app/board/components/Cursor";
import Whiteboard from "@/app/board/components/Whiteboard";
import Navbar from "@/app/components/Navbar";

import { subscribeTheUser } from "@/app/config/ably";

import type { UserEvent } from "@/app/types/UserEvent";
import { AblySpaceEventIdentifiers } from "@/app/types/AblySpaceEventIdentifiers";
import type { MembersLocation } from "@/app/types/MembersLocation";

import { addParticipant } from "@/services/boardService";

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
  const clientId = useBoundStore((state) => state.clientId);
  const setClientId = useBoundStore((state) => state.setClientId);
  const setGuestUser = useBoundStore((state) => state.setGuestUser);
  const setBoard = useBoundStore((state) => state.setBoard);

  const toast = useToast();

  const addParticipantMutation = useMutation(
    ({ id, user }: { id: string; user: string }) => addParticipant(id, user)
  );

  const getToastTitleForUserEvent = (event: string) => {
    switch (event) {
      case AblySpaceEventIdentifiers.PRESENT:
        return "entered";
      case AblySpaceEventIdentifiers.LEAVE:
        return "left";
    }
  };

  const handleUserEvent = (message: UserEvent) => {
    const newMembers = message.members;
    newMembers.sort((a, b) => {
      return a.lastEvent.timestamp - b.lastEvent.timestamp;
    });

    const lastUser = newMembers[newMembers.length - 1];
    const eventHappened = getToastTitleForUserEvent(lastUser.lastEvent.name);

    if (eventHappened === "entered") {
      const uniqueMembers = newMembers.filter(
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

    // toast({
    //   description:
    //     lastUser.clientId.split("&")[1] + " " + eventHappened + " the room",
    //   duration: 2000,
    //   isClosable: false,
    //   position: "bottom-left",
    //   variant: "left-accent",
    // });
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

  const handleAblyConnection = async () => {
    if (!clientId) return;

    const profileData: ProfileData = {
      name: session?.user?.name ? session?.user?.name : guestUser,
      email: session?.user?.email ? session?.user?.email : guestUser,
      avatar: session?.user?.image ? session?.user?.image : "",
    };

    const space = await subscribeTheUser(clientId!, params.id, profileData);

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

  const handleLeaveBoard = async () => {
    setGuestUser(null);
    setClientId(null);
    setBoard(null);

    if (status === "authenticated") {
      window.location.href = "/boards";
    } else {
      window.location.href = "/";
    }
  };

  const handleSaveBoard = () => {};

  useEffect(() => {
    if (status === "authenticated") {
      handleSaveBoard();
    }
    // TODO: add dependency of board data
  }, []);

  useEffect(() => {
    if (status === "authenticated" || !!guestUser) handleAblyConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, guestUser, clientId]);

  useEffect(() => {
    if (!guestUser && !session?.user?.name) return;

    if (!clientId) {
      setClientId(
        session?.user?.email
          ? session?.user?.email +
              "&" +
              session?.user?.name?.split(" ")[0] +
              "&user"
          : uniqid() + "&" + guestUser?.split(" ")[0] + "&guest"
      );
    }
  }, [clientId, session, guestUser, setClientId]);

  // add participants to the board
  useEffect(() => {
    if (status === "authenticated") {
      addParticipantMutation.mutate({
        id: params.id,
        user: session?.user?.email as string,
      });
    }
  }, []);

  return (
    <VStack minH="full" w="full" position="relative">
      <Navbar members={members} handleLeaveBoard={handleLeaveBoard} />

      <Whiteboard />

      {/* Cursor */}
      {membersLocation && membersLocation.length > 0 ? (
        <Box>
          {membersLocation.map((memberLocation) => {
            if (memberLocation.member.clientId === clientId) {
              return null;
            }

            return (
              <VStack
                key={memberLocation.member.clientId}
                position="absolute"
                left={memberLocation.x + "px"}
                top={memberLocation.y + "px"}
                zIndex={1000}
                alignItems="center"
              >
                <Cursor />
                <p>{memberLocation.member?.profileData?.name as string}</p>
              </VStack>
            );
          })}
        </Box>
      ) : null}

      {status === "unauthenticated" && !guestUser && <InitModal />}
    </VStack>
  );
};

export default Board;
