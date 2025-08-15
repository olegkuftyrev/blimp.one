// src/pages/IDP/JobTitleStep.jsx
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Stack,
  NativeSelect,
  Button,
  Table,
  Text,
} from "@chakra-ui/react";
import { useAppStore } from "../../store/useAppStore.js";
import { roles } from "../../data/roles.js";
import ActionNav from "../../components/ActionNav.jsx"


export default function JobTitleStep() {
  const navigate = useNavigate();
  const { jobTitleId, setJobTitle } = useAppStore();
  const selectedLabel = jobTitleId ?? ""; // empty when nothing selected
  const role = roles.find((r) => r.label === selectedLabel) || null;

  const comps = role?.competencies ?? [];

  const isDisabled = !selectedLabel;

  const handleContinue = () => {
    if (!isDisabled) {
      navigate("/idp/questions");
    }
  };

  return (
    <Flex minH="100vh" direction="column" bg="gray.50" px={4}>
      <Flex flex="1" align="center" justify="center">
        <Box w="100%" maxW="900px">
          <Heading mb={6} textAlign="center">
            Select Your Job Title
          </Heading>

          <Box bg="white" rounded="md" shadow="md" p={6}>
            {/* Job Title Selection */}
            <Text fontWeight="bold" mb={4} fontSize="lg">
              Select Your Job Title
            </Text>
            
            <NativeSelect.Root mb={6}>
              <NativeSelect.Field
                value={selectedLabel}
                onChange={(e) => setJobTitle(e.target.value)}
              >
                {!selectedLabel && (
                  <option value="" disabled>
                    select a title
                  </option>
                )}
                {roles.map((r) => (
                  <option key={r.label} value={r.label}>
                    {r.title}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            {/* Competencies */}
            {role && comps.length > 0 && (
              <>
                <Text fontWeight="bold" mb={3} fontSize="md">
                  Competencies
                </Text>
                <Table.Root size="sm" variant="simple" striped interactive>
                  <Table.Body>
                    {comps.map((c, i) => (
                      <Table.Row key={`${c.id}-${i}`}>
                        <Table.Cell>{c.label}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </>
            )}

            {/* Action Navigation */}
            {!isDisabled && (
              <ActionNav
                open={true}
                showBack={false}
                showNext={true}
                onNext={handleContinue}
                isNextDisabled={false}
              />
            )}
          </Box>

          {/* Bottom Card - Role Cards */}
          <Box mt={6} bg="white" rounded="md" shadow="md" p={6} width="100%">
            <Text fontWeight="bold" mb={4} fontSize="lg" color="gray.700">
              Role Cards
            </Text>

            <Stack spacing={6}>
              {/* Culture Core */}
              <Box>
                <Text fontWeight="semibold" mb={3} fontSize="md" color="teal.600">
                  Culture Core
                </Text>
                <Box p={3} bg="teal.50" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm">• Customer Focus</Text>
                    <Text fontSize="sm">• Decision Quality</Text>
                    <Text fontSize="sm">• Ensures Accountability</Text>
                    <Text fontSize="sm">• Values Differences</Text>
                    <Text fontSize="sm">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>

              {/* Hourly Associate */}
              <Box>
                <Text fontWeight="semibold" mb={3} fontSize="md" color="blue.600">
                  Hourly Associate
                </Text>
                <Box p={3} bg="blue.50" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm">• Action Oriented</Text>
                    <Text fontSize="sm">• Communicates Effectively</Text>
                    <Text fontSize="sm">• Customer Focus</Text>
                    <Text fontSize="sm">• Decision Quality</Text>
                    <Text fontSize="sm">• Ensures Accountability</Text>
                    <Text fontSize="sm">• Values Differences</Text>
                    <Text fontSize="sm">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>

              {/* AM/Chef, SM/GM, TL */}
              <Box>
                <Text fontWeight="semibold" mb={3} fontSize="md" color="green.600">
                  AM/Chef, SM/GM, TL
                </Text>
                <Box p={3} bg="green.50" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm">• Business Insight</Text>
                    <Text fontSize="sm">• Attracts and Develops Talent</Text>
                    <Text fontSize="sm">• Being Resilient</Text>
                    <Text fontSize="sm">• Action Oriented</Text>
                    <Text fontSize="sm">• Communicates Effectively</Text>
                    <Text fontSize="sm">• Customer Focus</Text>
                    <Text fontSize="sm">• Decision Quality</Text>
                    <Text fontSize="sm">• Ensures Accountability</Text>
                    <Text fontSize="sm">• Values Differences</Text>
                    <Text fontSize="sm">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>

              {/* ACO, RDO */}
              <Box>
                <Text fontWeight="semibold" mb={3} fontSize="md" color="red.600">
                  ACO, RDO
                </Text>
                <Box p={3} bg="red.50" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm">• Cultivates Innovation</Text>
                    <Text fontSize="sm">• Drives Results</Text>
                    <Text fontSize="sm">• Situational Adaptability</Text>
                    <Text fontSize="sm">• Courage</Text>
                    <Text fontSize="sm">• Business Insight</Text>
                    <Text fontSize="sm">• Attracts and Develops Talent</Text>
                    <Text fontSize="sm">• Being Resilient</Text>
                    <Text fontSize="sm">• Action Oriented</Text>
                    <Text fontSize="sm">• Communicates Effectively</Text>
                    <Text fontSize="sm">• Customer Focus</Text>
                    <Text fontSize="sm">• Decision Quality</Text>
                    <Text fontSize="sm">• Ensures Accountability</Text>
                    <Text fontSize="sm">• Values Differences</Text>
                    <Text fontSize="sm">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
