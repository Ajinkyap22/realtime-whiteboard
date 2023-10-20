"use client";

import React, { useState } from "react";

import {
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

type Props = {
  formLabel: string;
  inputType: string;
  placeholder: string;
  buttonText: string;
  alternativeButtonText: string;
  handleToggle: () => void;
  handleClick: () => void;
};

const InitBoard = ({
  formLabel,
  inputType,
  placeholder,
  buttonText,
  alternativeButtonText,
  handleToggle,
  handleClick,
}: Props) => {
  const [userName, setUserName] = useState("");

  const { status } = useSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  return (
    <>
      <VStack gap="6">
        {status === "unauthenticated" && (
          <FormControl isRequired>
            <FormLabel color="darkPrimary">Your Name</FormLabel>

            <Input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={handleInputChange}
            />
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel color="darkPrimary">{formLabel}</FormLabel>

          <Input type={inputType} placeholder={placeholder} />
        </FormControl>

        <Button
          onClick={handleClick}
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
          {buttonText}
        </Button>
      </VStack>

      <Text
        my="3"
        textAlign="center"
        color="darkPrimary"
        fontWeight="light"
        fontSize="lg"
      >
        or
      </Text>

      <HStack w="full" justifyContent="center">
        <Button
          w="full"
          onClick={handleToggle}
          h="0"
          py="5"
          bg="white"
          border="1px"
          borderColor="darkPrimary"
          color="darkPrimary"
          fontWeight="medium"
          _hover={{
            bg: "darkPrimary",
            color: "white",
          }}
        >
          {alternativeButtonText}
        </Button>
      </HStack>
    </>
  );
};

export default InitBoard;
