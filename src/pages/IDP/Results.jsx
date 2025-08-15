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
      <Box maxW="600px" mx="auto" w="100%">
        <Heading textAlign="center" mb={6}>
          {role?.title ?? "No Role Selected"}
        </Heading>
        <Stack spacing={6}>
          {/* Recommended to Develop */}
          {recommended.length > 0 && (
            <Box bg="white" rounded="md" shadow="md" p={4}>
              <Text fontWeight="bold" mb={2}>
                Recommended to Develop
              </Text>
              <Stack divideY="1px" spacing={0}>
                {recommended.map((comp) => (
                  <Box key={comp.id} py={3}>
                    <Text fontWeight="bold" mb={2}>
                      {comp.label}
                    </Text>
                    <Box ml={4}>
                      <List.Root as="ol" spacing={1}>
                        {comp.actions.map((a) => (
                          <List.Item key={a.id}>{a.action}</List.Item>
                        ))}
                      </List.Root>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* All Competencies (excluding those in Recommended) */}
          {others.length > 0 && (
            <Box bg="white" rounded="md" shadow="md" p={4}>
              <Text fontWeight="bold" mb={2}>
                All Competencies
              </Text>
              <Stack divideY="1px" spacing={0}>
                {others.map((comp) => (
                  <Box key={comp.id} py={3}>
                    <Text>{comp.label}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

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
        </Stack>
      </Box>
    </Flex>
  );
}
