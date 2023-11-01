"use client";

import React, { useEffect } from "react";

import { useSession, signOut } from "next-auth/react";
import { HStack, Button, Image, Avatar, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <HStack justifyContent="flex-end" w="full" p="3">
      {status === "authenticated" && (
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
      )}
    </HStack>
  );
};

export default Navbar;
