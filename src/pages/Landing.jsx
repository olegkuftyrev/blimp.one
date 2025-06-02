import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6}>
        <Heading size="lg">Choose your dashboard</Heading>
        <Button as={Link} to="/idp" colorScheme="green" size="lg">
          Individual Development Plan (IDP)
        </Button>
        <Button as={Link} to="/pl" colorScheme="blue" size="lg">
          P&amp;L Analysis
        </Button>
         <Button as={Link} to="/pl" colorScheme="blue" size="lg">
          P&amp;L Learning 
        </Button>
      </VStack>
    </Box>
  );
}
