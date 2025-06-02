// src/components/StepFooter.jsx
import { Flex, Box, Button, Progress, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore.js";

export default function StepFooter() {
  const navigate = useNavigate();
  const { currentStep, nextStep, prevStep } = useAppStore();

  // Простейшая схема маршрутов по шагам:
  const routes = ["/idp", "/idp/focus", "/pl"];
  const maxIndex = routes.length - 1;

  const handleNext = () => {
    if (currentStep < maxIndex) {
      nextStep();
      navigate(routes[currentStep + 1]);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      prevStep();
      navigate(routes[currentStep - 1]);
    }
  };

  return (
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="white"
      boxShadow="sm"
      py={3}
      px={4}
    >
      <Progress
        value={((currentStep + 1) / (maxIndex + 1)) * 100}
        size="sm"
        mb={2}
      />
      <Flex justify="space-between" align="center">
        <Button
          onClick={handleBack}
          isDisabled={currentStep === 0}
          variant="outline"
        >
          Back
        </Button>
        <Text fontSize="sm">
          Step {currentStep + 1} of {maxIndex + 1}
        </Text>
        <Button
          onClick={handleNext}
          isDisabled={currentStep === maxIndex}
          colorScheme="teal"
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}
