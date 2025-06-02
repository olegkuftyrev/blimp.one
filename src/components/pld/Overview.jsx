// src/components/pld/Overview.jsx
import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { safe } from "../../utils/calcUtils.js";

export default function Overview({ values }) {
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
  // Determine busiest
  const busiestEntry = Object.entries(dayparts).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max),
    ["", -Infinity]
  );
  const busiestLabel = busiestEntry[0];

  // OLO%
  const oloPercent =
    netSales > 0 ? ((thirdParty + pandaDigital) / netSales) * 100 : 0;

  // COGS% and Labor%
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

  // Build metrics list
  const metrics = [
    // Daypart %
    ...Object.entries(dayparts).map(([label, val]) => ({
      label,
      value: `${val.toFixed(2)}%`,
      highlight: label === busiestLabel,
    })),
    {
      label: "Actual Net Sales",
      value: `$${netSales.toLocaleString()}`,
      highlight: false,
    },
    {
      label: "Check Average",
      value: `$${checkAvg.toFixed(2)}`,
      highlight: false,
    },
    {
      label: "Total Transactions",
      value: `${transactions}`,
      highlight: false,
    },
    {
      label: "OLO %",
      value: `${oloPercent.toFixed(2)}%`,
      highlight: false,
    },
    {
      label: "COGS %",
      value: `${cogsPercent.toFixed(2)}%`,
      flag: cogsPercent > 30,
      highlight: false,
    },
    {
      label: "Labor %",
      value: `${laborPercent.toFixed(2)}%`,
      flag: laborPercent > 30,
      highlight: false,
    },
    { label: "Overtime Hours", value: `${overtimeHrs}`, highlight: false },
    {
      label: "Average Hourly Wage",
      value: `$${hourlyWage.toFixed(2)}`,
      highlight: false,
    },
    {
      label: "Prime Cost",
      value: `${primeCost.toFixed(2)}%`,
      flag: primeCost > 60,
      highlight: false,
    },
    {
      label: "Rent Total",
      value: `Act: $${rentActual.toLocaleString()}`,
      detail: `Pri: $${rentPrior.toLocaleString()}`,
      delta: `Δ $${rentDiff.toLocaleString()} (${rentPctDiff.toFixed(2)}%)`,
      highlight: false,
    },
    {
      label: "Repairs",
      value: `Act: $${repairsAct.toLocaleString()}`,
      detail: `Pri: $${repairsPri.toLocaleString()}`,
      delta: `Δ $${repairsDiff.toLocaleString()} (${repairsPct.toFixed(2)}%)`,
      highlight: false,
    },
    {
      label: "Maintenance",
      value: `Act: $${maintAct.toLocaleString()}`,
      detail: `Pri: $${maintPri.toLocaleString()}`,
      delta: `Δ $${maintDiff.toLocaleString()} (${maintPct.toFixed(2)}%)`,
      highlight: false,
    },
  ];

  return (
    <Flex wrap="wrap" width="100%" p={2}>
      {metrics.map((m, i) => (
        <Box key={i} flex={{ base: "100%", md: "50%", lg: "25%" }} p={2}>
          <Box
            borderWidth="1px"
            borderRadius="md"
            borderColor={m.highlight ? "orange.400" : "gray.200"}
            p={4}
            position="relative"
            bg="white"
            height="100%"
          >
            <Text fontWeight="bold" mb={1}>
              {m.label}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="semibold"
              color={m.flag ? "red.500" : "gray.800"}
            >
              {m.value}
            </Text>
            {m.detail && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                {m.detail}
              </Text>
            )}
            {m.delta && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                {m.delta}
              </Text>
            )}
            {m.flag && (
              <Text fontSize="sm" color="red.500" mt={1}>
                ⚠️
              </Text>
            )}
          </Box>
        </Box>
      ))}
    </Flex>
  );
}
