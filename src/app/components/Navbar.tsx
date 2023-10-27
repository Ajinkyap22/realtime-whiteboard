"use client";

import React, { useEffect } from "react";

import { HStack, Text, Avatar, Button, Image } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useBoundStore } from "@/zustand/store";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const guestUser = useBoundStore((state) => state.guestUser);
  const clientId = useBoundStore((state) => state.clientId);
  const setGuestUser = useBoundStore((state) => state.setGuestUser);
  const setClientId = useBoundStore((state) => state.setClientId);

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleLeaveBoard = () => {
    if (status === "authenticated") {
      // TODO: after integrating with backend, check if user has any boards if not then create a new board and redirect to it
    } else {
      setGuestUser(null);
      setClientId(null);
      router.push("/");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" && !guestUser && clientId) {
      router.push("/");
    }
  }, [status, guestUser, router, clientId]);

  useEffect(() => {
    if (status === "authenticated") {
      setGuestUser(null);
      setClientId(null);
    }
  }, [status, setGuestUser, setClientId]);

  if (pathname === "/") return null;

  return (
    <HStack justifyContent="flex-end" w="full" p="4">
      {status === "authenticated" ? (
        <HStack alignItems="center" gap="4">
          <HStack>
            <Avatar
              src={session.user?.image ?? ""}
              name={session.user?.name ?? "User"}
              size="sm"
            />

            <Text fontSize="sm">{session.user?.name}</Text>
          </HStack>

          <Button onClick={handleSignOut} p="0">
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

      <Button onClick={handleLeaveBoard}>
        <Text fontWeight="normal" fontSize="sm">
          Leave board
        </Text>
      </Button>
    </HStack>
  );
};

export default Navbar;
