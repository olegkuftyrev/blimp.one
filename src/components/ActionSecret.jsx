import { ActionBar, Portal, Input, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ActionSecret() {
  const [value, setValue] = useState("");
  const isValid = value === "pandaJOA2222";
  const navigate = useNavigate(); // импортируем хук

  const handleGo = () => {
    if (isValid) {
      navigate("/secret"); // вот это по-реактовски!
    }
  };

  return (
    <ActionBar.Root open={true}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <HStack spacing={2} w="full">
              <Input
                type="password"
                placeholder="Enter password"
                w="200px"
                autoFocus
                value={value}
                onChange={e => setValue(e.target.value)}
              />
              <Button colorScheme="teal" isDisabled={!isValid} onClick={handleGo}>
                GO
              </Button>
            </HStack>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
