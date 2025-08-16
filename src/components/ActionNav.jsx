import { ActionBar, Button, Portal } from "@chakra-ui/react";

export default function ActionNav({
  open = true,
  showBack = true,
  showNext = true,
  backLabel = "Back",
  nextLabel = "Continue",
  onBack,
  onNext,
  isBackDisabled = false,
  isNextDisabled = false,
}) {
  return (
    <ActionBar.Root open={open}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            {showBack && (
              <Button
                variant="ghost"
                size="lg"
                mr={2}
                onClick={onBack}
                isDisabled={isBackDisabled}
              >
                {backLabel}
              </Button>
            )}
            {showNext && (
              <Button
                colorScheme="teal"
                variant="surface"
                size="lg"
                onClick={onNext}
                isDisabled={isNextDisabled}
              >
                {nextLabel}
              </Button>
            )}
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
