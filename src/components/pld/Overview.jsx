// src/components/pld/Knows.jsx
import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { safe } from "../../utils/calcUtils.js";

export default function Knows({ values }) {
  if (!values || Object.keys(values).length === 0) return null;

  // Base metrics
  const checkAvg = safe(values["Check Avg - Net"]);
  const netSales = safe(values["Net Sales"]);
  const thirdParty = safe(values["3rd Party Digital Sales"]);
  const pandaDigital = safe(values["Panda Digital Sales"]);
  const hourlyWage = safe(values["Average Hourly Wage"]);
  const overtimeHrs = safe(values["Overtime Hours"]);
  const transactions = safe(values["Total Transactions"]);

  // Daypart %
  const dayparts = {
    "Breakfast %": safe(values["Breakfast %"]),
    "Lunch %": safe(values["Lunch %"]),
    "Afternoon %": safe(values["Afternoon %"]),
    "Evening %": safe(values["Evening %"]),
  };
  const busiestEntry = Object.entries(dayparts).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max),
    ["", -Infinity]
  );
  const busiestLabel = busiestEntry[0];

  // OLO %
  const oloPercent =
    netSales > 0 ? ((thirdParty + pandaDigital) / netSales) * 100 : 0;

  // COGS % and Labor %
  const cogsPercent =
    netSales > 0 ? (safe(values["Cost of Goods Sold"]) / netSales) * 100 : 0;
  const laborPercent =
    netSales > 0 ? (safe(values["Total Labor"]) / netSales) * 100 : 0;

  // Prime Cost = COGS% + Labor%
  const primeCost = cogsPercent + laborPercent;

  // Rent Total
  const rentKeys = [
    "Rent - MIN",
    "Rent - Storage",
    "Rent - Percent",
    "Rent - Other",
    "Rent - Deferred Preopening",
  ];
  const rentActual = rentKeys.reduce((sum, k) => sum + safe(values[k]), 0);
  const rentPrior = rentKeys.reduce(
    (sum, k) => sum + safe(values[`Prior ${k}`]),
    0
  );
  const rentDiff = rentActual - rentPrior;
  const rentPctDiff = rentPrior ? (rentDiff / rentPrior) * 100 : 0;

  // Repairs
  const repairsAct = safe(values["Repairs"]);
  const repairsPri = safe(values["Prior Repairs"]);
  const repairsDiff = repairsAct - repairsPri;
  const repairsPct = repairsPri ? (repairsDiff / repairsPri) * 100 : 0;

  // Maintenance
  const maintAct = safe(values["Maintenance"]);
  const maintPri = safe(values["Prior Maintenance"]);
  const maintDiff = maintAct - maintPri;
  const maintPct = maintPri ? (maintDiff / maintPri) * 100 : 0;

  // Build metrics array
  const metrics = [
    // Daypart %
    ...Object.entries(dayparts).map(([label, val]) => ({
      label,
      value: `${val.toFixed(2)}%`,
      isBusiest: label === busiestLabel,
    })),
    { label: "Actual Net Sales", value: `$${netSales.toLocaleString()}` },
    { label: "Check Average", value: `$${checkAvg.toFixed(2)}` },
    { label: "Total Transactions", value: `${transactions}` },
    { label: "OLO %", value: `${oloPercent.toFixed(2)}%` },
    {
      label: "COGS %",
      value: `${cogsPercent.toFixed(2)}%`,
      color: cogsPercent > 30 ? "red.500" : "green.500",
    },
    {
      label: "Labor %",
      value: `${laborPercent.toFixed(2)}%`,
      color: laborPercent > 30 ? "red.500" : "green.500",
    },
    { label: "Overtime Hours", value: `${overtimeHrs}` },
    { label: "Average Hourly Wage", value: `$${hourlyWage.toFixed(2)}` },
    {
      label: "Prime Cost",
      value: `${primeCost.toFixed(2)}%`,
      color: primeCost > 60 ? "red.500" : "green.500",
    },
    {
      label: "Rent Total",
      value: `Act: $${rentActual.toLocaleString()}`,
      detail: `Pri: $${rentPrior.toLocaleString()}`,
      delta: `Δ $${rentDiff.toLocaleString()} (${rentPctDiff.toFixed(2)}%)`,
    },
    {
      label: "Repairs",
      value: `Act: $${repairsAct.toLocaleString()}`,
      detail: `Pri: $${repairsPri.toLocaleString()}`,
      delta: `Δ $${repairsDiff.toLocaleString()} (${repairsPct.toFixed(2)}%)`,
    },
    {
      label: "Maintenance",
      value: `Act: $${maintAct.toLocaleString()}`,
      detail: `Pri: $${maintPri.toLocaleString()}`,
      delta: `Δ $${maintDiff.toLocaleString()} (${maintPct.toFixed(2)}%)`,
    },
  ];


  return (
    <Box w="100%">
      <Heading size="md" mb={4}>
        Key Metrics
      </Heading>

      {/* spacing={6} добавляет отступ между карточками */}
<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {metrics.map(({ label, value, detail, delta, color, isBusiest }, i) => (
          <Box
            key={i}
            position="relative"
            bg="white"
            borderRadius="md"
            shadow="sm"
            border="1px"
            p={4}
          >
            {isBusiest && (
              <Badge
                position="absolute"
                top="4px"
                right="4px"
                colorScheme="blackAlpha"
              >
                Busiest Time
              </Badge>
            )}
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500">
                {label}
              </Text>
              <Text fontWeight="bold" color={color || "inherit"}>
                {value}
              </Text>
              {detail && (
                <Text fontSize="xs" color="gray.500">
                  {detail}
                </Text>
              )}
              {delta && (
                <Text fontSize="xs" color="gray.700">
                  {delta}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
