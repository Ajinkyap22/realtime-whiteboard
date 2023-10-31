"use client";

import React, { useEffect } from "react";

import {
  HStack,
  Text,
  Avatar,
  Button,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useBoundStore } from "@/zustand/store";

import ShareModal from "@/app/components/ShareModal";

import { SpaceMember } from "@ably/spaces";
import AvatarStack from "./AvatarStack";

type Props = {
  members?: SpaceMember[];
  handleLeaveBoard?: () => void;
};

const Navbar = ({ members, handleLeaveBoard }: Props) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const guestUser = useBoundStore((state) => state.guestUser);
  const clientId = useBoundStore((state) => state.clientId);

  const setGuestUser = useBoundStore((state) => state.setGuestUser);
  const setClientId = useBoundStore((state) => state.setClientId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
  };

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

  if (pathname === "/") return null;

  return (
    <HStack justifyContent="flex-end" w="full" p="4" zIndex={1}>
      <HStack bg="white" shadow="all-around" p="4" borderRadius="md" gap="4">
        <AvatarStack members={members ?? []} />

        {handleLeaveBoard && (
          <>
            <Button colorScheme="messenger" onClick={onOpen}>
              <Text fontSize="sm">Share board</Text>
            </Button>

            <Button colorScheme="red" onClick={handleLeaveBoard}>
              <Text fontSize="sm">Leave</Text>
            </Button>
          </>
        )}

        {status === "authenticated" ? (
          <HStack alignItems="center" gap="4">
            <Button onClick={handleSignOut} px="3" py="5" h="0">
              <Image src="/icons/logout.svg" alt="Logout" w="4" h="4" />
            </Button>
          </HStack>
        ) : (
          <Button onClick={handleSignIn}>
            <Text fontWeight="normal" fontSize="sm">
              Sign in
            </Text>
          </Button>
        )}
      </HStack>

      {isOpen && <ShareModal isOpen={isOpen} onClose={onClose} />}
    </HStack>
  );
};

export default Navbar;
