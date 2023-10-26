import { VStack, Text, Image, HStack, Box } from "@chakra-ui/react";

import OnboardingCard from "@/app/components/OnboardingCard";

export default function Home() {
  return (
    <VStack
      minH="full"
      w="full"
      justifyContent="flex-start"
      alignItems="space-between"
      className="graph-bg"
    >
      <VStack
        py={{
          base: "10",
          md: "28",
        }}
        gap={{
          base: "10",
          md: "20",
        }}
      >
        <VStack gap="4" px="4">
          {/* title */}
          <HStack gap="4">
            <Image src="/icons/logo.svg" alt="Syncboard" w="12" h="12" />
            <Text fontSize="2xl" color="darkPrimary">
              Syncboard
            </Text>
          </HStack>

          {/* subtitle */}
          <Text fontSize="lg" color="darkPrimary" textAlign="center">
            The real-time whiteboard that keeps everyone in sync
          </Text>
        </VStack>

        <Box
          gap={{
            base: "2",
            md: "6",
          }}
          px="4"
          display="flex"
          flexDirection={{
            base: "column",
            md: "row",
          }}
          justifyContent="center"
          alignItems="center"
        >
          {/* start instantly */}
          <OnboardingCard type="create-board" />

          <Text
            textAlign="center"
            color="darkPrimary"
            fontWeight="light"
            fontSize="xl"
          >
            or
          </Text>

          {/* sign in */}
          <OnboardingCard type="sign in" />
        </Box>
      </VStack>
    </VStack>
  );
}
