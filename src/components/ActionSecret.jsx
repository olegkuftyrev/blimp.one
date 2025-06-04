// src/components/ActionSecret.jsx
import { ActionBar, Portal, Input, Button, HStack } from "@chakra-ui/react";
import { useState } from "react";

export default function ActionSecret() {
  const [value, setValue] = useState("");

  const isValid = value === "2475";

  const handleGo = () => {
    if (isValid) {
      window.location.href = "/secret";
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
