"use client";

import React from "react";

import { HStack, Text, Avatar, Button, Image } from "@chakra-ui/react";

import { signIn, signOut, useSession } from "next-auth/react";
import { createAblyConnection } from "./ably_connection/ablyConnection";

const Navbar = () => {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    unsubscribeTheUser();
    signOut();
  };

  const subscribeTheUser = async () => {
    const spaces = await createAblyConnection(
      session?.user?.email ?? "User"
    );

    const space = await spaces.get("board");

    await space.enter({ name: session?.user?.email ?? "User" });

    console.log("I'm in!");

    space.members.subscribe((member) => {
      console.log(member);
    });
  }

  if(session) {
    subscribeTheUser();
  }

  const unsubscribeTheUser = async () => {
    const spaces = await createAblyConnection(
      session?.user?.email ?? "User"
    );

    const space = await spaces.get("board");

    await space.leave();

    console.log("I'm out!");
  }

  return (
    <HStack justifyContent="flex-end" w="full" p="4">
      {session ? (
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