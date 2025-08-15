// src/pages/Landing.jsx
import { Box, Heading, SimpleGrid, VStack, Text, Button, HStack, Badge } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import ActionSecret from "../components/ActionSecret";
import { useState } from "react";
import { useCrossTabState } from "../hooks/useCrossTabState"; // <-- NEW

export default function Landing() {
  const tileStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    _hover: { filter: "brightness(105%)" },
  };

  const [clickCount, setClickCount] = useState(0);
  function handleSecretClick() {
    setClickCount((prev) => prev + 1);
  }

  // NEW: shared counter across windows/tabs
  const [presses, setPresses] = useCrossTabState("landing:presses", 0);

  return (
    <SimpleGrid columns={2} rows={3} minH="100vh" w="100%" spacing="0">
      {/* IDP */}
      <Box as={RouterLink} to="/idp" bg="#D02C2F" color="white" {...tileStyles}>
        <VStack spacing={2}>
          <Heading size="xl" textAlign="center">Individual Development Plan</Heading>
          <Text fontSize="lg" textAlign="center">Assess competencies</Text>
          <Text fontSize="lg" textAlign="center">Build growth plan</Text>
        </VStack>
      </Box>

      {/* P&L */}
      <Box as={RouterLink} to="/pl" bg="#032726" color="#5eead4" {...tileStyles}>
        <VStack spacing={2}>
          <Heading size="xl" textAlign="center">P&amp;L Analysis</Heading>
          <Text fontSize="lg" textAlign="center">Upload Excel file</Text>
          <Text fontSize="lg" textAlign="center">See key metrics</Text>
        </VStack>
      </Box>

      {/* Grow Camp 1 */}
      <Box
        as="a"
        href="https://drive.proton.me/urls/RD67MRYGD8#A236ZLdomwPL"
        target="_blank"
        rel="noopener noreferrer"
        bg="#6d4aff"
        color="white"
        onClick={handleSecretClick}
        {...tileStyles}
      >
        <VStack spacing={2}>
          <Heading size="xl" textAlign="center">Grow Camp</Heading>
          <Text fontSize="lg" textAlign="center">Training resources - Workshop material</Text>
          <Text fontSize="lg" textAlign="center">Shared Folder - Proton Drive</Text>
        </VStack>
      </Box>

      {/* Grow Camp 2 — disabled */}
      <Box as={RouterLink} to="/plstudy" bg="orange.600" color="white" {...tileStyles}>
        <VStack spacing={2}>
          <Heading size="sm" textAlign="center">P&amp;L Study</Heading>
          <Text fontSize="sm" textAlign="center">Practice tests & Explanations</Text>
          <Text fontSize="sm" textAlign="center">In development - Coming soon</Text>
        </VStack>
        {clickCount >= 3 && <ActionSecret />}
      </Box>

      {/* Placeholder 2 — under development */}
      <Box bg="gray.300" color="gray.600" filter="grayscale(100%)" pointerEvents="none" {...tileStyles}>
        <VStack spacing={2}>
          <Heading size="sm" textAlign="center">Talent Tracker</Heading>
          <Text fontSize="sm" textAlign="center">Under development</Text>
        </VStack>
      </Box>

      {/* Cross-window shared counter */}
      <Box
        bg="gray.100"
        color="gray.800"
        {...tileStyles}
        // make it interactive
      >
        <VStack spacing={3}>
          <Heading size="sm" textAlign="center">Cross window</Heading>
          <Text fontSize="sm" textAlign="center">
            Shared counter across tabs/windows
          </Text>

          <HStack spacing={3}>
            <Badge fontSize="md" colorScheme="teal">Count: {presses}</Badge>
            <Button
              size="sm"
              onClick={() => setPresses((n) => n + 1)}
              aria-label="Increment shared counter"
            >
              Press me
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPresses(0)}
              aria-label="Reset shared counter"
            >
              Reset
            </Button>
          </HStack>

          <Text fontSize="xs" opacity={0.7}>
            Opens two tabs of this page; clicking updates both instantly.
          </Text>
        </VStack>
      </Box>
    </SimpleGrid>
  );
}
