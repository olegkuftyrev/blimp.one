// src/components/pld/Controllables.jsx
import React from "react";
import { Table, Box } from "@chakra-ui/react";

const labels = [
  "Third Party Delivery Fee",
  "Credit Card Fees",
  "Broadband",
  "Electricity",
  "Gas",
  "Telephone",
  "Waste Disposal",
  "Water",
  "Computer Software Expense",
  "Office and Computer Supplies",
  "Education and Training Other",
  "Recruitment",
  "Professional Services",
  "Travel Expenses",
  "Bank Fees",
  "Dues and Subscriptions",
  "Moving and Relocation Expenses",
  "Other Expenses",
  "Postage and Courier Service",
  "Repairs",
  "Maintenance",
  "Restaurant Expenses",
  "Restaurant Supplies",
  "Total Controllables",
  "Profit Before Adv",
  "Advertising",
  "Corporate Advertising",
  "Media",
  "Local Store Marketing",
  "Grand Opening",
  "Lease Marketing",
  "Advertising",
  "Controllable Profit",
];

export default function Controllables({ rows }) {
  if (!rows?.length) return null;

  // 1) Найти строку заголовков
  const headerRow = rows.find((r) => r[0] === "Ledger Account");
  if (!headerRow) return null;

  // 2) Сформировать колонки для Chakra Table
  //    Первая колонка — «Controllables», остальные — из headerRow.slice(1)
  const columnHeaders = ["Controllables", ...headerRow.slice(1)];

  // 3) Собрать dataSource по списку labels
  const dataSource = labels.map((label, i) => {
    const row = rows.find((r) => r[0] === label) || [];
    // Каждая запись — массив значений: первый элемент — label, затем остальные из headerRow
    const cells = headerRow.slice(1).map((_, idx) => row[idx + 1] ?? null);
    return { key: i, label, cells };
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
      <Table.Root size="sm" variant="simple">
        {/* Заголовок таблицы */}
        <Table.Header>
          <Table.Row>
            {columnHeaders.map((col, idx) => (
              <Table.ColumnHeader key={idx} textAlign={idx === 0 ? "start" : "end"}>
                {col}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        {/* Тело таблицы */}
        <Table.Body>
          {dataSource.map(({ key, label, cells }) => (
            <Table.Row key={key}>
              {/* Первая ячейка — название controllable */}
              <Table.Cell>{label}</Table.Cell>
              {/* Остальные ячейки — значения */}
              {cells.map((val, idx) => (
                <Table.Cell key={idx} textAlign="end">
                  {val != null ? val.toLocaleString() : "-"}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
