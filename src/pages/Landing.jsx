// src/pages/Landing.jsx
import { Box, Heading, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import ActionSecret from "../components/ActionSecret";
import { useState } from "react";


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

  // обработчик клика для disabled box
  function handleSecretClick() {
    setClickCount((prev) => prev + 1);
  }

  return (
    <SimpleGrid columns={2} rows={2} minH="100vh" w="100%" spacing="0">
      {/* IDP */}
      <Box as={RouterLink} to="/idp" bg="#D02C2F" color="white" {...tileStyles}>
        <VStack spacing={2}>
          <Heading size="xl" textAlign="center">
            Individual Development Plan
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Assess competencies
          </Text>
          <Text fontSize="lg" textAlign="center">
            Build growth plan
          </Text>
        </VStack>
      </Box>

      {/* P&L */}
      <Box as={RouterLink} to="/pl" bg="#032726" color="#5eead4" {...tileStyles}>
        <VStack spacing={2}>
          <Heading size="xl" textAlign="center">
            P&amp;L Analysis
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Upload Excel file
          </Text>
          <Text fontSize="lg" textAlign="center">
            See key metrics
          </Text>
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
          <Heading size="xl" textAlign="center">
            Grow Camp
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Training resources - Workshop material       
          </Text>
          <Text fontSize="lg" textAlign="center">
            Shared Folder - Proton Drive
          </Text>
        </VStack>
      </Box>

      {/* Grow Camp 2 — disabled */}
      <Box
        bg="gray.300"
        color="gray.600"
        pointerEvents="auto" // чтобы Box был кликабелен
        filter="grayscale(100%)"
        {...tileStyles}
        onClick={handleSecretClick}
      >
        <VStack spacing={2}>
          <Heading size="sm" textAlign="center">
            P&L Study
          </Heading>
          <Text fontSize="sm" textAlign="center">
                Practice tests & Explanations
          </Text>
          <Text fontSize="sm" textAlign="center">
                    In development - Coming soon
          </Text>
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
        {/* Placeholder 2 — under development */}
      <Box as={RouterLink} to="/smg" bg="lightblue" color="darkblue" {...tileStyles}>        <VStack spacing={2}>
          <Heading size="sm" textAlign="center">SMG Tracker</Heading>
          <Text fontSize="sm" textAlign="center">Under development</Text>
        </VStack>
      </Box>
    </SimpleGrid>
  );
}
