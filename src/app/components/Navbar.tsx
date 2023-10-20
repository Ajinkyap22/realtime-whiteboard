"use client";

import React from "react";

import { HStack, Text, Avatar, Button, Image } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
  };

  if (status === "unauthenticated") return null;

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
    </HStack>
  );
};

export default Navbar;
