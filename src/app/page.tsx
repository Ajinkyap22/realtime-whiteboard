import { VStack, Text, Image, HStack } from "@chakra-ui/react";
import OnboardingCard from "@/app/components/OnboardingCard";

export default function Home() {
  return (
    <VStack
      h="full"
      w="full"
      justifyContent="flex-start"
      alignItems="space-between"
      className="graph-bg"
    >
      <VStack pt="28" gap="20">
        <VStack gap="4">
          {/* title */}
          <HStack gap="4">
            <Image src="/icons/logo.svg" alt="Syncboard" w="12" h="12" />
            <Text fontSize="2xl" color="darkPrimary">
              Syncboard
            </Text>
          </HStack>

          {/* subtitle */}
          <Text fontSize="lg" color="darkPrimary">
            The real-time whiteboard that keeps everyone in sync
          </Text>
        </VStack>

        <HStack gap="6">
          {/* start instantly */}
          <OnboardingCard type="create-board" />

          <Text color="darkPrimary" fontWeight="light" fontSize="xl">
            or
          </Text>

          {/* sign in */}
          <OnboardingCard type="sign in" />
        </HStack>
      </VStack>
    </VStack>
  );
}
