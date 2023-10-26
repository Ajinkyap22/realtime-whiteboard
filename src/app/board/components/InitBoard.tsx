"use client";

import React, { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";

import { useSession, signIn } from "next-auth/react";

import { useBoundStore } from "@/zustand/store";

type Props = {
  handleSave: (guestUserName: string) => void;
};

const InitBoard = ({ handleSave }: Props) => {
  const [guestUserName, setGuestUserName] = useState("");
  const setGuestUser = useBoundStore((state) => state.setGuestUser);

  const { status } = useSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestUserName(e.target.value);
  };

  const handleSignIn = () => {
    signIn("google");
  };

  useEffect(() => {
    if (status === "authenticated") {
      setGuestUser(null);
    }
  }, [status, setGuestUser]);

  return (
    <VStack gap="6">
      <FormControl isRequired>
        <FormLabel color="darkPrimary">What should we call you?</FormLabel>

        <Input
          value={guestUserName}
          type="text"
          placeholder='e.g. "John Doe"'
          onChange={handleInputChange}
        />
      </FormControl>

      <VStack gap="2" w="full">
        <Button
          isDisabled={!guestUserName}
          onClick={() => handleSave(guestUserName)}
          w="full"
          h="0"
          py="5"
          bg="darkPrimary"
          border="1px"
          borderColor="transparent"
          color="white"
          fontWeight="medium"
          _hover={{
            bg: "darkPrimary",
            color: "white",
          }}
        >
          Let&#39;s go!
        </Button>

        <Text
          textAlign="center"
          color="darkPrimary"
          fontWeight="light"
          fontSize="lg"
        >
          or
        </Text>

        <Button
          onClick={handleSignIn}
          w="full"
          h="0"
          py="5"
          bg="transparent"
          border="1px"
          borderColor="darkPrimary"
          color="darkPrimary"
          fontWeight="medium"
          _hover={{
            bg: "darkPrimary",
            color: "white",
          }}
        >
          Sign in
        </Button>
      </VStack>
    </VStack>
  );
};

export default InitBoard;
