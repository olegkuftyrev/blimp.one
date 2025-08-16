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

            <Flex gap={6} direction={{ base: "column", lg: "row" }} align="end">

              {/* Hourly Associate */}
              <Box flex="1">
                <Text fontWeight="semibold" mb={3} fontSize="md" color="#DD8F43">
                  Hourly Associate
                </Text>
                <Box p={3} bg="#DD8F43" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Action Oriented</Text>
                    <Text fontSize="sm" color="white">• Communicates Effectively</Text>
                  </Stack>
                </Box>
                
                {/* Culture Core */}
                <Box mt={4} p={3} bg="#7F9D91" rounded="md">
                  <Text fontWeight="semibold" mb={2} fontSize="sm" color="white">
                    Culture Core
                  </Text>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Customer Focus</Text>
                    <Text fontSize="sm" color="white">• Decision Quality</Text>
                    <Text fontSize="sm" color="white">• Ensures Accountability</Text>
                    <Text fontSize="sm" color="white">• Values Differences</Text>
                    <Text fontSize="sm" color="white">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>

              {/* AM/Chef, SM/GM, TL */}
              <Box flex="1">
                <Text fontWeight="semibold" mb={3} fontSize="md" color="#8CA558">
                  AM/Chef, SM/GM, TL
                </Text>
                <Box p={3} bg="#8CA558" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Business Insight</Text>
                    <Text fontSize="sm" color="white">• Attracts and Develops Talent</Text>
                    <Text fontSize="sm" color="white">• Being Resilient</Text>
                  </Stack>
                </Box>
                
                {/* Hourly Associate */}
                <Box mt={4} p={3} bg="#DD8F43" rounded="md">
                  <Text fontWeight="semibold" mb={2} fontSize="sm" color="white">
                    Hourly Associate
                  </Text>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Action Oriented</Text>
                    <Text fontSize="sm" color="white">• Communicates Effectively</Text>
                  </Stack>
                </Box>

                {/* Culture Core */}
                <Box mt={4} p={3} bg="#7F9D91" rounded="md">
                  <Text fontWeight="semibold" mb={2} fontSize="sm" color="white">
                    Culture Core
                  </Text>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Customer Focus</Text>
                    <Text fontSize="sm" color="white">• Decision Quality</Text>
                    <Text fontSize="sm" color="white">• Ensures Accountability</Text>
                    <Text fontSize="sm" color="white">• Values Differences</Text>
                    <Text fontSize="sm" color="white">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>

              {/* ACO, RDO */}
              <Box flex="1">
                <Text fontWeight="semibold" mb={3} fontSize="md" color="#BF3536">
                  ACO, RDO
                </Text>
                <Box p={3} bg="#BF3536" rounded="md">
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Cultivates Innovation</Text>
                    <Text fontSize="sm" color="white">• Drives Results</Text>
                    <Text fontSize="sm" color="white">• Situational Adaptability</Text>
                    <Text fontSize="sm" color="white">• Courage</Text>
                  </Stack>
                </Box>
                
                {/* AM/Chef, SM/GM, TL */}
                <Box mt={4} p={3} bg="#8CA558" rounded="md">
                  <Text fontWeight="semibold" mb={2} fontSize="sm" color="white">
                    AM/Chef, SM/GM, TL
                  </Text>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Business Insight</Text>
                    <Text fontSize="sm" color="white">• Attracts and Develops Talent</Text>
                    <Text fontSize="sm" color="white">• Being Resilient</Text>
                  </Stack>
                </Box>

                {/* Hourly Associate */}
                <Box mt={4} p={3} bg="#DD8F43" rounded="md">
                  <Text fontWeight="semibold" mb={2} fontSize="sm" color="white">
                    Hourly Associate
                  </Text>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Action Oriented</Text>
                    <Text fontSize="sm" color="white">• Communicates Effectively</Text>
                  </Stack>
                </Box>

                {/* Culture Core */}
                <Box mt={4} p={3} bg="#7F9D91" rounded="md">
                  <Text fontWeight="semibold" mb={2} fontSize="sm" color="white">
                    Culture Core
                  </Text>
                  <Stack spacing={1}>
                    <Text fontSize="sm" color="white">• Customer Focus</Text>
                    <Text fontSize="sm" color="white">• Decision Quality</Text>
                    <Text fontSize="sm" color="white">• Ensures Accountability</Text>
                    <Text fontSize="sm" color="white">• Values Differences</Text>
                    <Text fontSize="sm" color="white">• Integrity and Trust</Text>
                  </Stack>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
