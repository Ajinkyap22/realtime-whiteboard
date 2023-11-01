import React from "react";

import {
  Card,
  GridItem,
  CardHeader,
  Heading,
  Image,
  CardBody,
  HStack,
} from "@chakra-ui/react";

type Props = {
  handleCreate: () => void;
};

const CreateBoardCard = ({ handleCreate }: Props) => {
  return (
    <GridItem as={Card} cursor="pointer" onClick={handleCreate}>
      <CardHeader pb="3">
        <Heading size="md" textAlign="center" color="darkPrimary">
          Create New Board
        </Heading>
      </CardHeader>

      <CardBody as={HStack} justifyContent="center" pt="3">
        <Image src="/icons/add.svg" w="24" h="24" alt="create board" />
      </CardBody>
    </GridItem>
  );
};

export default CreateBoardCard;
