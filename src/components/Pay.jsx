// src/components/pld/PayRateTable.jsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Table,
  Flex,
} from "@chakra-ui/react";
import rolesData from "../data/pay";

const PayRateTable = () => {
  const { roles, regions } = rolesData;
  const [storeInput, setStoreInput] = useState("");
  const [searchedRegion, setSearchedRegion] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const num = parseInt(storeInput, 10);
    if (isNaN(num)) {
      setSearchedRegion(null);
      setNotFound(true);
      return;
    }
    const found = regions.find((region) => region.stores.includes(num));
    if (found) {
      setSearchedRegion(found);
      setNotFound(false);
    } else {
      setSearchedRegion(null);
      setNotFound(true);
    }
  };

  return (
    <Box p={4} bg="white" rounded="md" shadow="md">
      <Heading size="lg" mb={4}>
        Pay Rates by Region and Role (2025)
      </Heading>
      <Flex mb={6} gap={2} align="center">
        <Input
          placeholder="Enter store number"
          size="md"
          width="200px"
          value={storeInput}
          onChange={(e) => setStoreInput(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button colorScheme="blue" onClick={handleSearch}>
          Check
        </Button>
        <Text color="gray.500" fontSize="sm">
          Search by store number
        </Text>
      </Flex>

      {searchedRegion && (
        <Box mb={6}>
          <Heading size="md" mb={2}>
            {searchedRegion.name} (Store #{storeInput})
          </Heading>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
                <Table.ColumnHeader>Pay Rate</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {roles.map((role) => (
                <Table.Row key={role}>
                  <Table.Cell>{role}</Table.Cell>
                  <Table.Cell>
                    {searchedRegion.pay[role]
                      ? `$${searchedRegion.pay[role].toFixed(2)}`
                      : "--"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {notFound && (
        <Text color="red.500" mb={6}>
          No region found for store #{storeInput}
        </Text>
      )}


      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            {regions.map((region) => (
              <Table.ColumnHeader key={region.name}>
                {region.name}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {roles.map((role) => (
            <Table.Row key={role}>
              <Table.Cell>{role}</Table.Cell>
              {regions.map((region) => (
                <Table.Cell key={region.name + role}>
                  {region.pay[role]
                    ? `$${region.pay[role].toFixed(2)}`
                    : "--"}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Box mt={6}>
        <Heading size="md" mb={2}>
          Store Numbers by Region
        </Heading>
        {regions.map((region) => (
          <Box key={region.name} mb={2}>
            <Text fontWeight="bold">{region.name}:</Text>
            <Text fontSize="sm" wordBreak="break-all">
              {region.stores.join(", ")}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PayRateTable;
