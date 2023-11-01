"use client";

import React, { useEffect, useState } from "react";

import { HStack, Text, Button, Image, useDisclosure } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useBoundStore } from "@/zustand/store";

import ShareModal from "@/app/components/ShareModal";
import Divider from "@/app/components/Divider";

import { SpaceMember } from "@ably/spaces";
import AvatarStack from "./AvatarStack";
import BoardName from "./BoardName";

type Props = {
  members?: SpaceMember[];
  handleLeaveBoard?: () => void;
};

const Navbar = ({ members, handleLeaveBoard }: Props) => {
  const { status } = useSession();
  const pathname = usePathname();

  const guestUser = useBoundStore((state) => state.guestUser);
  const clientId = useBoundStore((state) => state.clientId);

  const setGuestUser = useBoundStore((state) => state.setGuestUser);
  const setClientId = useBoundStore((state) => state.setClientId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (status === "unauthenticated" && !guestUser && clientId) {
      handleLeaveBoard && handleLeaveBoard();
    }
  }, [status, guestUser, clientId, handleLeaveBoard]);

  useEffect(() => {
    if (status === "authenticated") {
      setGuestUser(null);
      setClientId(null);
    }
  }, [status, setGuestUser, setClientId]);

  const handleSignOut = () => {
    signOut();
  };

  if (pathname === "/") return null;

  return (
    <HStack justifyContent="space-between" w="full" p="4" px="6">
      <HStack
        bg="white"
        shadow="all-around"
        px="4"
        py="1.5"
        borderRadius="md"
        gap="4"
        zIndex={1}
      >
        {/* logo */}
        <HStack gap="4">
          <Image src="/icons/logo.svg" alt="Syncboard" w="6" h="6" />
          <Text fontSize="md" color="darkPrimary">
            Syncboard
          </Text>
        </HStack>

        <Divider />

        {/* board name & edit */}
        <BoardName />

        <Divider />

        {/* download button */}
        <HStack
          as={Button}
          h="0"
          py="5"
          px="4"
          bg="transparent"
          _hover={{
            bg: "gray.50",
          }}
        >
          <Image src="/icons/download.svg" alt="edit" w="5" h="5" />
          <Text fontSize="sm" color="darkPrimary" fontWeight="normal">
            Download
          </Text>
        </HStack>
      </HStack>

      <HStack
        bg="white"
        shadow="all-around"
        p="4"
        borderRadius="md"
        gap="4"
        zIndex={1}
      >
        <AvatarStack members={members ?? []} />

        {handleLeaveBoard && (
          <>
            <Button
              bg="#687EFF"
              color="white"
              onClick={onOpen}
              _hover={{
                bg: "#596cdc",
                color: "white",
              }}
            >
              <Text fontSize="sm">Share board</Text>
            </Button>

            <Button
              bg="#df5d5d"
              color="white"
              onClick={handleLeaveBoard}
              _hover={{
                bg: "#cc5151",
                color: "white",
              }}
            >
              <Text fontSize="sm">Leave</Text>
            </Button>
          </>
        )}

        {status === "authenticated" && (
          <HStack alignItems="center" gap="4">
            <Button onClick={handleSignOut} px="3" py="5" h="0">
              <Image src="/icons/logout.svg" alt="Logout" w="4" h="4" />
            </Button>
          </HStack>
        )}
      </HStack>

      {isOpen && <ShareModal isOpen={isOpen} onClose={onClose} />}
    </HStack>
  );
};

export default Navbar;
