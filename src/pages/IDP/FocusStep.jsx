// src/pages/IDP/FocusStep.jsx
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Stack,
  Text,
  Button,
  HStack,
  Code,
} from "@chakra-ui/react";
import { useAppStore } from "../../store/useAppStore.js";
import { roles } from "../../data/roles.js";
import { useState, useEffect } from "react";

export default function FocusStep() {
  const navigate = useNavigate();
  const {
    jobTitleId,
    setCompetencyScores,
    focusSkills,
    setFocusSkill,
  } = useAppStore();
  const role = roles.find((r) => r.label === jobTitleId) || null;

  useEffect(() => {
    if (!role) {
      navigate("/idp");
    }
  }, [role, navigate]);

  const comps = role?.competencies ?? [];
  const skills = role?.skills ?? [];
  const studySkills = skills.filter((s) => s.learningStyle === "study");
  const practiceSkills = skills.filter((s) => s.learningStyle === "practice");
  const mentorshipSkills = skills.filter((s) => s.learningStyle === "mentorship");

  const [compSelected, setCompSelected] = useState(false);
  const [studySelected, setStudySelected] = useState(false);
  const [practiceSelected, setPracticeSelected] = useState(false);
  const [mentorshipSelected, setMentorshipSelected] = useState(false);

  useEffect(() => {
    setFocusSkill("competency", compSelected);
  }, [compSelected, setFocusSkill]);

  useEffect(() => {
    setFocusSkill("study", studySelected);
  }, [studySelected, setFocusSkill]);

  useEffect(() => {
    setFocusSkill("practice", practiceSelected);
  }, [practiceSelected, setFocusSkill]);

  useEffect(() => {
    setFocusSkill("mentorship", mentorshipSelected);
  }, [mentorshipSelected, setFocusSkill]);

  const anySelected =
    compSelected || studySelected || practiceSelected || mentorshipSelected;

  const handleContinue = () => {
    if (!anySelected) return;

    if (compSelected) {
      navigate("/idp/questions");
    } else {
      setCompetencyScores({});
      navigate("/idp/results");
    }
  };

  const renderCompCard = () =>
    comps.length > 0 && (
      <Box
        bg="white"
        rounded="md"
        shadow={compSelected ? "outline" : "md"}
        borderWidth={compSelected ? "2px" : "1px"}
        borderColor={compSelected ? "teal.500" : "gray.200"}
        p={4}
        cursor="pointer"
        onClick={() => setCompSelected((prev) => !prev)}
        _hover={{ bg: "gray.50" }}
      >
        <Text fontWeight="bold" mb={2}>
          Competencies
        </Text>
        <Stack spacing={1}>
          {comps.map((c, i) => (
            <Text key={`${c.id}-${i}`} fontSize="sm">
              • {c.label}
            </Text>
          ))}
        </Stack>
      </Box>
    );

  const renderStudyCard = () =>
    studySkills.length > 0 && (
      <Box
        bg="white"
        rounded="md"
        shadow={studySelected ? "outline" : "md"}
        borderWidth={studySelected ? "2px" : "1px"}
        borderColor={studySelected ? "teal.500" : "gray.200"}
        p={4}
        cursor="pointer"
        onClick={() => setStudySelected((prev) => !prev)}
        _hover={{ bg: "gray.50" }}
      >
        <Text fontWeight="bold" mb={2}>
          Study Skills
        </Text>
        <Stack spacing={1}>
          {studySkills.map((s, i) => (
            <Text key={`${s.id}-${i}`} fontSize="sm">
              • {s.label}
            </Text>
          ))}
        </Stack>
      </Box>
    );

  const renderPracticeCard = () =>
    practiceSkills.length > 0 && (
      <Box
        bg="white"
        rounded="md"
        shadow={practiceSelected ? "outline" : "md"}
        borderWidth={practiceSelected ? "2px" : "1px"}
        borderColor={practiceSelected ? "teal.500" : "gray.200"}
        p={4}
        cursor="pointer"
        onClick={() => setPracticeSelected((prev) => !prev)}
        _hover={{ bg: "gray.50" }}
      >
        <Text fontWeight="bold" mb={2}>
          Practice Skills
        </Text>
        <Stack spacing={1}>
          {practiceSkills.map((s, i) => (
            <Text key={`${s.id}-${i}`} fontSize="sm">
              • {s.label}
            </Text>
          ))}
        </Stack>
      </Box>
    );

  const renderMentorshipCard = () =>
    mentorshipSkills.length > 0 && (
      <Box
        bg="white"
        rounded="md"
        shadow={mentorshipSelected ? "outline" : "md"}
        borderWidth={mentorshipSelected ? "2px" : "1px"}
        borderColor={mentorshipSelected ? "teal.500" : "gray.200"}
        p={4}
        cursor="pointer"
        onClick={() => setMentorshipSelected((prev) => !prev)}
        _hover={{ bg: "gray.50" }}
      >
        <Text fontWeight="bold" mb={2}>
          Mentorship Skills
        </Text>
        <Stack spacing={1}>
          {mentorshipSkills.map((s, i) => (
            <Text key={`${s.id}-${i}`} fontSize="sm">
              • {s.label}
            </Text>
          ))}
        </Stack>
      </Box>
    );

  return (
    <Flex minH="100vh" bg="gray.50" px={4} py={6} direction="column">
      <Box maxW="600px" mx="auto" w="100%">
        <Heading mb={2} textAlign="center">
          {role?.title}
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center" mb={2}>
          Choose your focus
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign="center" mb={6}>
          Click on a card to select it (selected cards are highlighted)
        </Text>

        <Stack spacing={6}>
          {renderCompCard()}
          {renderStudyCard()}
          {renderPracticeCard()}
          {renderMentorshipCard()}

          <HStack justify="space-between">
            <Button onClick={() => navigate("/idp")} colorScheme="gray">
              Back
            </Button>
            <Button
              onClick={handleContinue}
              isDisabled={!anySelected}
              bg={!anySelected ? "gray.400" : "teal.500"}
              color="white"
              _hover={!anySelected ? {} : { bg: "teal.600" }}
            >
              Continue
            </Button>
          </HStack>

          {/* Debug: показываем содержимое focusSkills */}
          <Box mt={8} p={4} bg="gray.100" rounded="md">
            <Text fontSize="sm" mb={2}>
              <strong>Debug focusSkills:</strong>
            </Text>
            <Code w="100%" p={2}>
              {JSON.stringify(focusSkills, null, 2)}
            </Code>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}
