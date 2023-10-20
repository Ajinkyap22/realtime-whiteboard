"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";

import { useSession } from "next-auth/react";

import { subscribeTheUser } from "@/app/config/ably";
import { CursorUpdate, SpaceMember } from "@ably/spaces";

import type { MembersLocation } from "@/app/types/MembersLocation";
import type { UserEvent } from "@/app/types/UserEvent";
import { AblySpaceEventIdentifiers } from "@/app/types/AblySpaceEventIdentifiers";

const HomeForm = () => {
  const [roomName, setRoomName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [membersLocation, setMembersLocation] = useState<MembersLocation[]>([]);

  const { data: session } = useSession();
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
    const lastUser = members[members.length - 1];
    const eventHappened = getToastTitleForUserEvent(lastUser.lastEvent.name);

    if (eventHappened === "entered") {
      setMembers(members);

      setMembersLocation(
        members.map((member) => {
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
        lastUser.clientId.split(" ")[0] + " " + eventHappened + " the room",
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const randomUniqueName =
      guestName + " " + Math.random().toString(36).substring(7);

    window.localStorage.setItem("guestName", randomUniqueName); // need to implement redux here as well

    const space = await subscribeTheUser(
      session?.user?.email ?? randomUniqueName,
      roomName
    ); // need to implement redux here to store room name

    space.subscribe((message) => {
      handleUserEvent(message);
    });

    space.cursors.subscribe("update", (cursorEvent) => {
      handleCursorEvent(cursorEvent);
    });

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      space.cursors.set({ position: { x: clientX, y: clientY } });
    });
  };

  return (
    <>
      {membersLocation && membersLocation.length > 0 ? (
        <Box>
          {membersLocation.map((memberLocation) => {
            if (
              memberLocation.member.clientId ===
                window.localStorage.getItem("guestName") ||
              memberLocation.member.clientId === session?.user?.email
            ) {
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
                <p>{memberLocation.member.clientId.split(" ")[0]}</p>
              </Box>
            );
          })}
        </Box>
      ) : null}

      <Box as="form" p="4" onSubmit={handleFormSubmit}>
        <FormControl isRequired>
          {!session && (
            <FormControl isRequired>
              <FormLabel>Enter your name </FormLabel>

              <Input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </FormControl>
          )}

          <FormLabel>
            Join / Create a room{" "}
            {session ? `as ${session?.user?.name?.split(" ")[0]}` : ""}
          </FormLabel>

          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Join / Create Room
        </Button>
      </Box>
    </>
  );
};

export default HomeForm;
