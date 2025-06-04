// src/components/pld/COGSChart.jsx
import React, { useMemo } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Table,
  Text,
} from "@chakra-ui/react";

const CATEGORIES = [
  "Grocery",
  "Meat",
  "Produce",
  "Sea Food",
  "Drinks",
  "Paper Goods",
  "Other",
];
const TOTALS = ["Cost of Goods Sold"];

export default function COGSChart({ rows }) {
  if (!rows?.length) return null;

  // Найдём строку заголовков
  const headerRow = rows.find((r) => r[0] === "Ledger Account");
  if (!headerRow) return null;

  // Индексы Actual и Prior Year
  const actualIdx = headerRow.findIndex(
    (c) => typeof c === "string" && /actual/i.test(c) && !/ytd/i.test(c)
  );
  const priorIdx = headerRow.findIndex(
    (c) => typeof c === "string" && /prior year/i.test(c)
  );
  if (actualIdx < 0 || priorIdx < 0) return null;

  // Функция для формирования данных
  const makeData = (labels) =>
    labels.map((label, i) => {
      const row = rows.find((r) => r[0] === label) || [];
      const actual = Number(row[actualIdx]) || 0;
      const prior = Number(row[priorIdx]) || 0;
      return {
        key: i,
        label,
        actual,
        prior,
        diff: actual - prior,
      };
    });

  const dataCats = useMemo(() => makeData(CATEGORIES), [rows]);
  const dataTotal = useMemo(() => makeData(TOTALS), [rows]);


  // Рендер одной таблицы
  const RenderTable = ({ title, data }) => (
    <Box bg="white" borderRadius="md" shadow="md" p={4}>
      <Heading size="sm" mb={4}>
        {title}
      </Heading>
      <Table.Root size="sm" variant="simple">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Actual</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Prior Year</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Difference</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(({ key, label, actual, prior, diff }) => (
            <Table.Row
              key={key}
              borderBottom="1px"
            >
              <Table.Cell>{label}</Table.Cell>
              <Table.Cell textAlign="end">
                {actual.toLocaleString()}
              </Table.Cell>
              <Table.Cell textAlign="end">
                {prior.toLocaleString()}
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Text color={diff >= 0 ? "red.500" : "green.500"}>
                  {diff.toLocaleString()}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} w="100%">
      <RenderTable
        title="COGS by Category vs Prior Year"
        data={dataCats}
      />
      <RenderTable
        title="Total COGS vs Prior Year"
        data={dataTotal}
      />
    </SimpleGrid>
  );
}
