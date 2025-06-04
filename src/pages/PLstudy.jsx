// src/pages/PLstudy.jsx
import React from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { plquestions } from "../data/plquestions.js";

export default function PLstudy() {
  return (
    <VStack spacing={6} align="stretch" p={4} width="100%">
      <Heading size="lg" textAlign="center">
        P&amp;L Study Questions
      </Heading>
      {plquestions.map((question) => {
        return (
          <Box
            key={question.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg="white"
            shadow="sm"
          >
            <Text fontWeight="bold" mb={3}>
              {question.id}. {question.label}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
              {["a1", "a2", "a3", "a4"].map((ansKey) => {
                const isCorrect = question.correctAnswer === ansKey;
                return (
                  <Button
                    key={ansKey}
                    isDisabled
                    variant="outline"
                    colorScheme={isCorrect ? "teal" : "gray"}
                    justifyContent="flex-start"
                    borderWidth={isCorrect ? "2px" : undefined}
                  >
                    {question[ansKey]}
                  </Button>
                );
              })}
            </SimpleGrid>
            <Text fontSize="sm" color="gray.600">
              Explanation: {question.explanation}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
}
