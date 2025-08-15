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
  Accordion,
  DataList,
} from "@chakra-ui/react";
import { useAppStore } from "../../store/useAppStore.js";
import { roles } from "../../data/roles.js";
import ActionNav from "../../components/ActionNav.jsx"


export default function JobTitleStep() {
  const navigate = useNavigate();
  const { jobTitleId, setJobTitle } = useAppStore();
  const selectedLabel = jobTitleId ?? ""; // empty when nothing selected
  const role = roles.find((r) => r.label === selectedLabel) || null;

  const skills = role?.skills ?? [];
  const comps = role?.competencies ?? [];

  const isDisabled = !selectedLabel;

  // Группируем навыки по learningStyle
  const mentorshipSkills = skills.filter((s) => s.learningStyle === "mentorship");
  const studySkills = skills.filter((s) => s.learningStyle === "study");
  const practiceSkills = skills.filter((s) => s.learningStyle === "practice");

  // Порядок категорий: Study → Practice → Mentorship
  const skillCategories = [
    { value: "study", title: "Study", items: studySkills },
    { value: "practice", title: "Practice", items: practiceSkills },
    { value: "mentorship", title: "Mentorship", items: mentorshipSkills },
  ].filter((cat) => cat.items.length > 0);

  const handleContinue = () => {
    if (!isDisabled) {
      navigate("/idp/questions");
    }
  };

  return (
    <Flex minH="100vh" direction="column" bg="gray.50" px={4}>
      <Flex flex="1" align="center" justify="center">
        <Box w="100%" maxW="460px">
          <Heading mb={6} textAlign="center">
            Select Your Job Title
          </Heading>

          <Stack spacing={4}>
            {/* Селектор: placeholder только когда ничего не выбрано */}
            <NativeSelect.Root>
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
              <Box bg="white" rounded="md" shadow="md" p={4}>
                <Text fontWeight="bold" mb={2}>
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
              </Box>
            )}

            {/* Skills в виде аккордеона с DataList внутри */}
            {role && skillCategories.length > 0 && (
              <Box bg="white" rounded="md" shadow="md" p={4}>
                <Text fontWeight="bold" mb={2}>
                  Skills
                </Text>
                <Accordion.Root collapsible>
                  {skillCategories.map((cat) => (
                    <Accordion.Item key={cat.value} value={cat.value}>
                      <Accordion.ItemTrigger display="flex" alignItems="center">
                        <Box flex="1" textAlign="left">
                          {cat.title}
                        </Box>
                        <Accordion.ItemIndicator />
                      </Accordion.ItemTrigger>
                      <Accordion.ItemContent>
                        <Accordion.ItemBody>
                          <DataList.Root
                            orientation="horizontal"
                            divideY="1px"
                            maxW="100%"
                          >
                            {cat.items.map((s) => (
                              <DataList.Item key={s.id} pt="4">
                                <DataList.ItemLabel w="140px">
                                  {s.label}
                                </DataList.ItemLabel>
                                <DataList.ItemValue>
                                  {s.note ?? ""}
                                </DataList.ItemValue>
                              </DataList.Item>
                            ))}
                          </DataList.Root>
                        </Accordion.ItemBody>
                      </Accordion.ItemContent>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </Box>
            )}
                        {/* Кнопка Continue 
                        <Button
                        onClick={handleContinue}
                        isDisabled={isDisabled}
                        bg={isDisabled ? "gray.400" : undefined}
                        color="white"
                        _hover={isDisabled ? {} : undefined}
                        >
                        {isDisabled ? "Disabled" : "Continue"}
                        </Button>*/}
           

            {!isDisabled && (
  <ActionNav
    open={true}
    showBack={false}
    showNext={true}
    onNext={handleContinue}
    isNextDisabled={false} // Можно вообще не передавать
  />
)}

          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
}
