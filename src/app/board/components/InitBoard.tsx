"use client";

import React, { useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

type Props = {
  handleSave: (guestUserName: string) => void;
};

const InitBoard = ({ handleSave }: Props) => {
  const [guestUserName, setGuestUserName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestUserName(e.target.value);
  };

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

      <Button
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
    </VStack>
  );
};

export default InitBoard;
