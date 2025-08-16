// src/pages/IDP/Results.jsx
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Link,
  List,
  Badge,
} from "@chakra-ui/react";
import { useAppStore } from "../../store/useAppStore.js";
import { roles } from "../../data/roles.js";
import ActionNav from "../../components/ActionNav.jsx"


export default function Results() {
  const navigate = useNavigate();
  const {
    jobTitleId,
    setCompetencyScores,
    setJobTitle,
    competencyScores,
  } = useAppStore();

  const role = roles.find((r) => r.label === jobTitleId) || null;

  // We're always focusing on competencies, so all competencies will be shown based on their scores

  // Split competencies into recommended (score < 4) and others (score >= 4)
  const recommended = role
    ? role.competencies.filter((comp) => (competencyScores[comp.id] ?? 0) < 4)
    : [];
  const others = role
    ? role.competencies.filter((comp) => (competencyScores[comp.id] ?? 0) >= 4)
    : [];

  const handleStartOver = () => {
    setJobTitle(null);
    setCompetencyScores({});
    navigate("/idp");
  };

  return (
    <Flex minH="100vh" bg="gray.50" px={4} py={6} direction="column">
      <Box  mx="auto" w="100%">
        <Heading textAlign="center" mb={6}>
          {"Results" ?? "No Role Selected"}
        </Heading>
        
        {/* Summary Section */}
        {role && (
          <Box mb={8} p={6} bg="white" rounded="md" shadow="sm" border="1px solid" borderColor="gray.200">
            <Heading as="h3" size="md" mb={4} color="gray.700">
              Competency Summary
            </Heading>
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={2}
            >
              {role.competencies
                .sort((a, b) => (competencyScores[a.id] ?? 0) - (competencyScores[b.id] ?? 0))
                .map((comp) => {
                  const score = competencyScores[comp.id] ?? 0;
                  const isUnskilled = score <= 2;
                  const statusColor = isUnskilled ? "red.500" : "green.500";
                  const statusText = isUnskilled ? "Unskilled" : "Skilled";
                  
                  return (
                    <Flex key={comp.id} justify="space-between" align="center" py={2} px={3}>
                      <Text fontWeight="medium" color="gray.700" fontSize="sm">
                        {comp.label}
                      </Text>
                      <HStack spacing={3}>
                        <Text fontSize="md" fontWeight="bold" color="gray.800">
                          {score}
                        </Text>
                        <Badge 
                          bg={statusColor}
                          color="white"
                          fontSize="xs"
                          px={2}
                          py={1}
                          fontWeight="medium"
                          rounded="md"
                        >
                          {statusText}
                        </Badge>
                      </HStack>
                    </Flex>
                  );
                })}
            </Box>
          </Box>
        )}
        
        {/* All Competencies in Separate Cards - Sorted by Score (0 to 5) */}
        <Box mb={6}>
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={6}
          >
            {role?.competencies
              .sort((a, b) => (competencyScores[a.id] ?? 0) - (competencyScores[b.id] ?? 0))
              .map((comp) => {
            const score = competencyScores[comp.id] ?? 0;
            const isUnskilled = score <= 2;
            const statusText = isUnskilled ? "Unskilled" : "Skilled";
            
            return (
              <Box 
                key={comp.id} 
                bg="white" 
                rounded="md" 
                shadow="md" 
                p={6}
                border="1px solid"
                borderColor="gray.200"
              >
                {/* H2: Competency name with score on the right */}
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h2" size="md" color="gray.800">
                    {comp.label}
                  </Heading>
                  <Badge 
                    colorScheme="gray" 
                    variant="solid" 
                    fontSize="md" 
                    px={3} 
                    py={1}
                  >
                    Score: {score}
                  </Badge>
                </Flex>
                
                {/* Status indicator */}
                <Box mb={4}>
                  <Badge 
                    bg={isUnskilled ? "red.500" : "green.500"}
                    color="white"
                    fontSize="sm"
                    px={3}
                    py={1}
                    fontWeight="medium"
                    rounded="md"
                  >
                    {statusText}
                  </Badge>
                </Box>
                
                {/* Questions and Actions */}
                <Stack spacing={4}>
                  {comp.questions.map((question, qIndex) => (
                    <Box key={question.id} p={3} bg="gray.50" rounded="md" border="1px solid" borderColor="gray.200">
                      {/* H3: Question */}
                      <Heading as="h3" size="sm" mb={2} color="gray.700">
                        {question.question}
                      </Heading>
                      {/* Description: Suggested action */}
                      {comp.actions[qIndex] && (
                        <Text fontSize="sm" color="gray.600" ml={2}>
                          <strong>Suggested Action:</strong> {comp.actions[qIndex].action}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            );
          })}
          </Box>
        </Box>

        {/* Buttons */}
        <HStack justify="space-between">
          <ActionNav
            open={true}
            showBack={true}
            showNext={true}
            backLabel="Back"
            nextLabel="Start Over"
            onBack={() => navigate("/idp")}
            onNext={handleStartOver}
            isNextDisabled={false}
          />
        </HStack>
      </Box>
    </Flex>
  );
}
