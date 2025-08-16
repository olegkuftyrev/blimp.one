// src/pages/IDP/JobTitleStep.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  Flex, Box, Heading, Stack, Text, Badge,
} from "@chakra-ui/react";
import { useAppStore } from "../../store/useAppStore.js";
import { roles } from "../../data/roles.js";
import ActionNav from "../../components/ActionNav.jsx";

export default function JobTitleStep() {
  const navigate = useNavigate();
  const { jobTitleId, setJobTitle } = useAppStore();
  const [selectedColumn, setSelectedColumn] = useState(null);

  // Helper: find an actual role.label from roles by common aliases/keywords
  const findRoleLabel = (candidates) => {
    const lc = candidates.map((s) => String(s).toLowerCase());
    const hit =
      roles.find((r) => {
        const L = (r.label ?? "").toLowerCase();
        const T = (r.title ?? "").toLowerCase();
        return lc.some((q) => L === q || T === q || L.includes(q) || T.includes(q));
      })?.label || null;
    return hit;
  };

  // Map cards -> labels in your roles
  const LABELS = useMemo(() => {
    const SHIFT_LEADER = findRoleLabel(["shift leader", "team leader", "tl", "shift"]);
    const ASSISTANT_MANAGER = findRoleLabel(["assistant manager", "chef", "am"]);
    const ACO = findRoleLabel(["aco"]);
    return { SHIFT_LEADER, ASSISTANT_MANAGER, ACO };
  }, [roles]);

  // Keep card highlight synced with the store value
  useEffect(() => {
    const map = {
      [LABELS.SHIFT_LEADER ?? ""]: 1,
      [LABELS.ASSISTANT_MANAGER ?? ""]: 2,
      [LABELS.ACO ?? ""]: 3,
    };
    setSelectedColumn(map[jobTitleId] ?? null);
  }, [jobTitleId, LABELS]);

  const setCard = (col) => {
    setSelectedColumn(col);
    if (col === 1 && LABELS.SHIFT_LEADER) setJobTitle(LABELS.SHIFT_LEADER);
    if (col === 2 && LABELS.ASSISTANT_MANAGER) setJobTitle(LABELS.ASSISTANT_MANAGER); // Chef -> Assistant Manager
    if (col === 3 && LABELS.ACO) setJobTitle(LABELS.ACO);
  };

  // Ready only when we resolved a real label (prevents downstream guards from blocking)
  const isReady = Boolean(jobTitleId);

  const handleContinue = () => {
    if (isReady) navigate("/idp/questions");
  };

  // Guard rail: if any mapping failed, show nothing clickable for that card (prevents silent no-op)
  const cardDisabled = {
    1: !LABELS.SHIFT_LEADER,
    2: !LABELS.ASSISTANT_MANAGER,
    3: !LABELS.ACO,
  };

  const Card = ({ col, title, blocks }) => (
    <Box
      flex="1"
      bg="white"
      rounded="md"
      shadow="md"
      p={{ base: 4, md: 6 }}
      cursor={cardDisabled[col] ? "not-allowed" : "pointer"}
      opacity={cardDisabled[col] ? 0.5 : 1}
      onClick={() => !cardDisabled[col] && setCard(col)}
      role="button"
      aria-pressed={selectedColumn === col}
      tabIndex={cardDisabled[col] ? -1 : 0}
      onKeyDown={(e) => !cardDisabled[col] && (e.key === "Enter" || e.key === " ") && setCard(col)}
      _hover={{ transform: { base: "none", md: cardDisabled[col] ? "none" : "scale(1.02)" } }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" mb={4} direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.700">
          {title}
        </Text>
        {selectedColumn === col && <Badge colorScheme="blue">Selected</Badge>}
      </Flex>
      <Box flex="1">
        {blocks.map(({ color, items }, idx) => (
          <Box key={idx} mt={idx === 0 ? 0 : 3} p={3} bg={color} rounded="md">
            <Stack spacing={1}>
              {items.map((t, i) => (
                <Text key={i} fontSize="sm" color="white">• {t}</Text>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Flex minH="100vh" direction="column" bg="gray.50" px={{ base: 2, md: 4 }}>
      <Flex flex="1" align="center" justify="center" py={{ base: 4, md: 6 }}>
        <Box w="100%" maxW="900px">
          <Heading mb={{ base: 4, md: 6 }} textAlign="center" size={{ base: "lg", md: "xl" }}>
            Select Your Job Title
          </Heading>

          <Flex mt={{ base: 4, md: 6 }} gap={{ base: 4, md: 6 }} direction={{ base: "column", lg: "row" }} align="stretch">
            <Card
              col={1}
              title="Hourly Associate"
              blocks={[
                { color: "#DD8F43", items: ["Action Oriented", "Communicates Effectively"] },
                { color: "#7F9D91", items: ["Customer Focus", "Decision Quality", "Ensures Accountability", "Values Differences", "Integrity and Trust"] },
              ]}
            />
            <Card
              col={2}
              title="AM/Chef, SM/GM, TL"
              blocks={[
                { color: "#8CA558", items: ["Business Insight", "Attracts and Develops Talent", "Being Resilient"] },
                { color: "#DD8F43", items: ["Action Oriented", "Communicates Effectively"] },
                { color: "#7F9D91", items: ["Customer Focus", "Decision Quality", "Ensures Accountability", "Values Differences", "Integrity and Trust"] },
              ]}
            />
            <Card
              col={3}
              title="ACO, RDO"
              blocks={[
                { color: "#BF3536", items: ["Cultivates Innovation", "Drives Results", "Situational Adaptability", "Courage"] },
                { color: "#8CA558", items: ["Business Insight", "Attracts and Develops Talent", "Being Resilient"] },
                { color: "#DD8F43", items: ["Action Oriented", "Communicates Effectively"] },
                { color: "#7F9D91", items: ["Customer Focus", "Decision Quality", "Ensures Accountability", "Values Differences", "Integrity and Trust"] },
              ]}
            />
          </Flex>

          {isReady && (
            <ActionNav
              open={true}
              showBack={false}
              showNext={true}
              onNext={handleContinue}     // ensure ActionNav uses this prop
              isNextDisabled={!isReady}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
