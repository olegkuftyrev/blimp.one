// onChange={handleFileUpload}>


import { ActionBar, Portal, Button, Input, HStack, Text, FileUpload, Icon, Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HiUpload } from "react-icons/hi"


export default function PLUploadBar({ onFile, handleFileUpload }) {
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (onFile) onFile(file);
    }
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFileName("");
  };

  return (
    <ActionBar.Root open={true}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content onChange={handleFileUpload}>
            <HStack spacing={4}>
              {!fileName ? (

                 

                  <FileUpload.Root>
                    <FileUpload.HiddenInput />
                    <FileUpload.Trigger asChild>
                        <Button variant="ghost" size="sm">
                        <HiUpload /> Upload File
                        </Button>
                    </FileUpload.Trigger>
                    <FileUpload.List />
                 </FileUpload.Root>

              ) : (
                <>
                  <Text fontSize="sm" color="teal.600">{fileName}</Text>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    colorScheme="gray"
                  >
                    Choose another
                  </Button>
                </>
              )}
            </HStack>

          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
