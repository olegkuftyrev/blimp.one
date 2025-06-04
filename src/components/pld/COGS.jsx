// src/components/pld/COGS.jsx
import React from "react";
import {
  Box,
  Text,
  Table,
  Heading,
} from "@chakra-ui/react";

const LABELS = [
  "Grocery",
  "Meat",
  "Produce",
  "Sea Food",
  "Drinks",
  "Paper Goods",
  "Other",
  "Cost of Goods Sold",
];

export default function COGS({ rows }) {
  if (!rows?.length) return null;

  // Найдём строку заголовков по "Ledger Account"
  const headerRow = rows.find((r) => r[0] === "Ledger Account");
  if (!headerRow) return null;

  // Заголовки колонок: headerRow[1..end]
  const columnTitles = headerRow.slice(1);

  // Собираем dataSource (аналог record в AntD)
  const dataSource = LABELS.map((label, i) => {
    const row = rows.find((r) => r[0] === label) || [];
    const record = { key: i, label };
    columnTitles.forEach((_, idx) => {
      record[`col${idx + 1}`] = row[idx + 1];
    });
    return record;
  });

  return (
    <Box
      bg="white"
      borderRadius="md"
      shadow="md"
      p={4}
      w="100%"
      overflowX="auto"
    >
      <Heading size="md" mb={4}>
        Cost&nbsp;of&nbsp;Goods
      </Heading>

      <Table.Root size="sm" variant="simple">
        <Table.Header>
          <Table.Row>
            {/* Первая колонка — "Cost of Sales" */}
            <Table.ColumnHeader>Cost of Sales</Table.ColumnHeader>
            {columnTitles.map((title, idx) => (
              <Table.ColumnHeader key={idx} textAlign="end">
                {title || "-"}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {dataSource.map((record) => (
            <Table.Row key={record.key}>
              <Table.Cell>{record.label}</Table.Cell>
              {columnTitles.map((_, idx) => {
                const val = record[`col${idx + 1}`];
                return (
                  <Table.Cell key={idx} textAlign="end">
                    {val != null && val !== "" ? val.toLocaleString() : "-"}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
