// src/pages/IDP/CompetencyQuestions.jsx
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useAppStore } from "../../store/useAppStore.js";
import { roles } from "../../data/roles.js";
import { useState, useEffect } from "react";
import ActionNav from "../../components/ActionNav.jsx"


export default function CompetencyQuestions() {
  const navigate = useNavigate();
  const { jobTitleId, setCompetencyScores } = useAppStore();
  const role = roles.find((r) => r.label === jobTitleId) || null;
  const competencies = role?.competencies ?? [];

  // answers: { "compId-qId": "yes" | "no" }
  const [answers, setAnswers] = useState({});
  // scores: { [compId]: numberOfYes }
  const [scores, setScores] = useState({});

  // If no role is selected, go back to job title step
  useEffect(() => {
    if (!role) {
      navigate("/idp");
    } else {
      const initialScores = {};
      competencies.forEach((comp) => {
        initialScores[comp.id] = 0;
      });
      setScores(initialScores);
    }
  }, [role, competencies, navigate]);

  // Check if all questions in a competency are answered
  const isCompAnswered = (comp) =>
    comp.questions.every((q) => answers[`${comp.id}-${q.id}`] !== undefined);

  // Handle answer selection
  const handleAnswer = (compId, qId, value) => {
    const key = `${compId}-${qId}`;
    setAnswers((prev) => {
      const updated = { ...prev, [key]: value };

      // Recalculate score for this competency
      const compScore = competencies
        .find((c) => c.id === compId)
        .questions.filter((q) => updated[`${compId}-${q.id}`] === "yes")
        .length;

      setScores((prevScores) => ({
        ...prevScores,
        [compId]: compScore,
      }));

      return updated;
    });
  };

  // Submit if all competencies are fully answered
  const handleSubmit = () => {
    const allAnswered = competencies.every(isCompAnswered);
    if (allAnswered) {
      // Store scores in global state
      setCompetencyScores(scores);
      navigate("/idp/results");
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50" px={4} py={6} direction="column">
      <Box maxW="700px" mx="auto" w="100%">
        <Heading textAlign="center" mb={6}>
          Competency Questions
        </Heading>

        {role ? (
          <Stack spacing={8}>
            {competencies.map((comp, index) => {
              const prevAnswered =
                index === 0 || isCompAnswered(competencies[index - 1]);
              const disabledCard = !prevAnswered;

              return (
                <Box
                  key={comp.id}
                  bg={disabledCard ? "gray.100" : "white"}
                  rounded="md"
                  shadow="md"
                  p={6}
                  opacity={disabledCard ? 0.6 : 1}
                  pointerEvents={disabledCard ? "none" : "auto"}
                >
                  <Text fontWeight="bold" fontSize="lg" mb={4}>
                    {comp.label} (Score: {scores[comp.id] ?? 0})
                  </Text>

                  {prevAnswered ? (
                    <Stack spacing={0} divideY="1px" divideColor="gray.200">
                      {comp.questions.map((q) => {
                        const key = `${comp.id}-${q.id}`;
                        const answered = answers[key];
                        return (
                          <Box key={key} py={4}>
                            <Flex align="center" justify="space-between">
                              <Text flex="1">{q.question}</Text>
                              <HStack spacing={4}>
                                <Button
                                  onClick={() => handleAnswer(comp.id, q.id, "yes")}
                                  variant={answered === "yes" ? "solid" : "outline"}
                                  colorScheme="teal"
                                >
                                  Yes
                                </Button>
                                <Button
                                  onClick={() => handleAnswer(comp.id, q.id, "no")}
                                  variant={answered === "no" ? "solid" : "outline"}
                                  colorScheme="teal"
                                >
                                  No
                                </Button>
                              </HStack>
                            </Flex>
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Text color="gray.500" fontStyle="italic">
                      Please complete the previous competency to view its questions.
                    </Text>
                  )}
                </Box>
              );
            })}

                        {competencies.every(isCompAnswered) && (
                            <ActionNav
                                open={true}
                                showBack={true}
                                showNext={true}
                                onBack={() => navigate("/idp")}
                                onNext={handleSubmit}
                                isNextDisabled={false}
                            />
                            )}
          </Stack>
        ) : (
          <Text textAlign="center" color="red.500">
            No role selected.
          </Text>
        )}
      </Box>
    </Flex>
  );
}
