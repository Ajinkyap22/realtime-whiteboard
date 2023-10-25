"use client";

import React, { useEffect } from "react";

import { HStack, Text, Avatar, Button, Image } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBoundStore } from "@/zustand/store";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const guestUser = useBoundStore((state) => state.guestUser);

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
  };

  // useEffect(() => {
  //   if (status === "unauthenticated" && !guestUser) {
  //     router.push("/");
  //   }
  // }, [status, guestUser, router]);

  if (status === "unauthenticated" && !guestUser) return null;

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
