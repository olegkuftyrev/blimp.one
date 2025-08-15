// src/components/pld/Knows.jsx
import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  Badge,
  VStack,
  Tooltip,
  Stat,
  HStack,
} from "@chakra-ui/react";
import { 
  safe,
  calcLabor,
  calcControllableProfit,
  calcAdjustedCP,
  calcRestaurantContribution,
  calcCashFlow,
  calcFlowThru,
  calcLaborPercent,
  calcControllableProfitPercent,
  calcCPImprovement,
  calcSSS,
} from "../../utils/calcUtils.js";

export default function Knows({ values, rows, actualIdx }) {
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

  // Financial calculations from PLCalc
  const actual = safe(values['Net Sales']);
  const prior = safe(values['Prior Net Sales']);
  const plan = safe(values['Plan Net Sales']);
  const direct = safe(values['Direct Labor']);
  const mgmt = safe(values['Management Labor']);
  const tax = safe(values['Taxes and Benefits']);
  const laborTot = calcLabor({
    'Direct Labor': direct,
    'Management Labor': mgmt,
    'Taxes and Benefits': tax,
  });

  const cogs = safe(values['Cost of Goods Sold']);
  const controllables = safe(values['Total Controllables']);
  
  // Ищет последний Advertising перед Controllable Profit
  function getLastAdvertisingBeforeCP(rows, actualIdx) {
    if (!rows || !actualIdx) return 0;
    const cpIndex = rows.findIndex(row => row[0] === 'Controllable Profit');
    if (cpIndex === -1) return 0;
    for (let i = cpIndex - 1; i >= 0; i--) {
      if ((rows[i][0] || '').toString().trim() === 'Advertising') {
        return safe(rows[i][actualIdx]);
      }
    }
    return 0;
  }
  
  const adv = getLastAdvertisingBeforeCP(rows, actualIdx);

  const cp = calcControllableProfit({ netSales: actual, cogs, labor: laborTot, controllables, advertising: adv });
  const cpPrior = safe(values['Prior Controllable Profit']);
  const cpChange = calcCPImprovement(cp, cpPrior);

  const bonus = safe(values['Bonus']);
  const wc = safe(values['Workers Comp']);
  const adjCP = calcAdjustedCP(cp, bonus, wc);

  const fixed = safe(values['Total Fixed Cost']);
  const restaurant = calcRestaurantContribution(cp, fixed);

  const amort = safe(values['Amortization']);
  const depr = safe(values['Depreciation']);
  const cashflow = calcCashFlow(restaurant, amort, depr);

  const flow = calcFlowThru(cp, cpPrior, actual, prior);
  const cpPercent = calcControllableProfitPercent(cp, actual);
  const laborPerc = calcLaborPercent(laborTot, actual);
  const sss = calcSSS(actual, prior);

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
      isRent: true,
    },
    {
      label: "Repairs",
      value: `Act: $${repairsAct.toLocaleString()}`,
      detail: `Pri: $${repairsPri.toLocaleString()}`,
      delta: `Δ $${repairsDiff.toLocaleString()} (${repairsPct.toFixed(2)}%)`,
      isRepairs: true,
    },
    {
      label: "Maintenance",
      value: `Act: $${maintAct.toLocaleString()}`,
      detail: `Pri: $${maintPri.toLocaleString()}`,
      delta: `Δ $${maintDiff.toLocaleString()} (${maintPct.toFixed(2)}%)`,
      isMaintenance: true,
    },
  ];

  // Financial metrics array
  const financialMetrics = [
    {
      label: "Net Sales (Actual)",
      value: `$${netSales.toLocaleString()}`,
      formula: "Net Sales (Actual)",
    },
    {
      label: "COGS $",
      value: `$${safe(values["Cost of Goods Sold"]).toLocaleString()}`,
      formula: "Cost of Goods Sold",
    },
    {
      label: "COGS %",
      value: `${cogsPercent.toFixed(2)}%`,
      color: cogsPercent >= 30 ? "red.500" : "green.500",
      formula: "COGS / Net Sales * 100",
    },
    {
      label: "Restaurant Contribution",
      value: `$${((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Total Fixed Cost"])).toLocaleString()}`,
      formula: "CP - Fixed Cost",
    },
    {
      label: "Cash Flow",
      value: `$${((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Total Fixed Cost"]) + safe(values["Amortization"]) + safe(values["Depreciation"])).toLocaleString()}`,
      formula: "RC + Amortization + Depreciation",
    },
    {
      label: "Flow Thru %",
      value: `${((((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Prior Controllable Profit"])) / (netSales - safe(values["Prior Net Sales"])) * 100) || 0).toFixed(2)}%`,
      color: ((((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Prior Controllable Profit"])) / (netSales - safe(values["Prior Net Sales"])) * 100) || 0) >= 0 ? "green.500" : "red.500",
      formula: "(CP Actual - CP Prior) / (Net Sales Actual - Net Sales Prior) * 100",
    },
    {
      label: "SSS %",
      value: `${((netSales - safe(values["Prior Net Sales"])) / safe(values["Prior Net Sales"]) * 100 || 0).toFixed(2)}%`,
      color: ((netSales - safe(values["Prior Net Sales"])) / safe(values["Prior Net Sales"]) * 100 || 0) >= 0 ? "green.500" : "red.500",
      formula: "(Actual Net Sales - Prior Net Sales) / Prior Net Sales * 100",
    },
  ];

  // Controllable Profit metrics array
  const cpMetrics = [
    {
      label: "Controllable Profit $",
      value: `Act: $${(netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)).toLocaleString()}`,
      detail: `Pri: $${safe(values["Prior Controllable Profit"]).toLocaleString()}`,
      delta: `CP Improvement: $${((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Prior Controllable Profit"])).toLocaleString()}`,
      color: ((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Prior Controllable Profit"])) >= 0 ? "green.500" : "red.500",
      formula: "Net Sales - (COGS + Labor + Controllables + Advertising)",
      isCP: true,
    },
    {
      label: "CP %",
      value: `${((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) / netSales * 100).toFixed(2)}%`,
      formula: "CP / Net Sales * 100",
    },
    {
      label: "Adjusted CP",
      value: `$${(netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0) + safe(values["Bonus"]) + safe(values["Workers Comp"])).toLocaleString()}`,
      formula: "CP + Bonus + Workers Comp",
    },
    {
      label: "Total Controllables",
      value: `$${safe(values["Total Controllables"]).toLocaleString()}`,
      formula: "Total Controllables",
    },
  ];

  // Labor metrics array
  const laborMetrics = [
    {
      label: "Labor Total",
      value: `$${safe(values["Total Labor"]).toLocaleString()}`,
      formula: "Direct + Management + Taxes",
    },
    {
      label: "Labor %",
      value: `${laborPercent.toFixed(2)}%`,
      color: laborPercent > 30 ? "red.500" : "black",
      formula: "Total Labor / Net Sales * 100",
    },
    {
      label: "Direct Labor",
      value: `$${safe(values["Direct Labor"]).toLocaleString()}`,
      formula: "Direct Labor",
    },
    {
      label: "Management Labor",
      value: `$${safe(values["Management Labor"]).toLocaleString()}`,
      formula: "Management Labor",
    },
    {
      label: "Taxes & Benefits",
      value: `$${safe(values["Taxes and Benefits"]).toLocaleString()}`,
      formula: "Taxes and Benefits",
    },
    {
      label: "Average Hourly Wage",
      value: `$${hourlyWage.toFixed(2)}`,
      formula: "Average Hourly Wage",
    },
    {
      label: "Total Labor Hours",
      value: `${(safe(values["Total Labor"]) / safe(values["Average Hourly Wage"])).toFixed(0)}`,
      formula: "Total Labor $ / Average Hourly Wage",
    },
    {
      label: "Productivity",
      value: `$${(netSales / (safe(values["Total Labor"]) / safe(values["Average Hourly Wage"]) || 1)).toFixed(2)}`,
      color: (netSales / (safe(values["Total Labor"]) / safe(values["Average Hourly Wage"]) || 1)) > 100 ? "green.500" : "red.500",
      formula: "Net Sales / Total Labor Hours",
    },
    {
      label: "Overtime Hours",
      value: `${overtimeHrs}`,
      color: overtimeHrs > 5 ? "red.500" : "green.500",
      formula: "Overtime Hours",
    },
  ];


  return (
    <Box width="100%">
      <Heading size="md" marginBottom={4}>
        Key Metrics
      </Heading>

      {/* spacing={6} добавляет отступ между карточками */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {metrics.map(({ label, value, detail, delta, color, isBusiest, formula, isRepairs, isMaintenance, isRent }, i) => (
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
                top={2}
                right={2}
                colorScheme="blackAlpha"
              >
                Busiest Time
              </Badge>
            )}
            {isRepairs || isMaintenance || isRent ? (
              <Stat.Root>
                <Stat.Label fontSize="sm" color="gray.500">
                  {label}
                </Stat.Label>
                <HStack>
                  <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  <Badge colorPalette={isRepairs ? (repairsDiff >= 0 ? "red" : "green") : isMaintenance ? (maintDiff >= 0 ? "red" : "green") : (rentDiff >= 0 ? "red" : "green")} gap="0">
                    {isRepairs ? (repairsDiff >= 0 ? <Stat.UpIndicator /> : <Stat.DownIndicator />) : isMaintenance ? (maintDiff >= 0 ? <Stat.UpIndicator /> : <Stat.DownIndicator />) : (rentDiff >= 0 ? <Stat.UpIndicator /> : <Stat.DownIndicator />)}
                    {Math.abs(isRepairs ? repairsPct : isMaintenance ? maintPct : rentPctDiff).toFixed(2)}%
                  </Badge>
                </HStack>
                {detail && (
                  <Stat.HelpText fontSize="xs" color="gray.500" mb="0">
                    {detail}
                  </Stat.HelpText>
                )}
                {delta && (
                  <Stat.HelpText fontSize="xs" color="gray.700" mb="0">
                    {delta}
                  </Stat.HelpText>
                )}
                {formula && (
                  <Stat.HelpText fontSize="xs" color="gray.400" mb="0">
                    {formula}
                  </Stat.HelpText>
                )}
              </Stat.Root>
            ) : (
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">
                  {label}
                </Text>
                <Text fontWeight="bold" color={color || "inherit"} fontSize="xl">
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
                {formula && (
                  <Text fontSize="xs" color="gray.400">
                    {formula}
                  </Text>
                )}
              </VStack>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Heading size="md" marginTop={8} marginBottom={4}>
        Financial Metrics
      </Heading>

      {/* spacing={6} добавляет отступ между карточками */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {financialMetrics.map(({ label, value, detail, delta, color, isBusiest, formula }, i) => (
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
                top={2}
                right={2}
                colorScheme="blackAlpha"
              >
                Busiest Time
              </Badge>
            )}
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500">
                {label}
              </Text>
              <Text fontWeight="bold" color={color || "inherit"} fontSize="xl">
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
              {formula && (
                <Text fontSize="xs" color="gray.400">
                  {formula}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Heading size="md" marginTop={8} marginBottom={4}>
        Controllable Profit Metrics
      </Heading>

      {/* spacing={6} добавляет отступ между карточками */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {cpMetrics.map(({ label, value, detail, delta, color, isBusiest, formula, isCP }, i) => (
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
                top={2}
                right={2}
                colorScheme="blackAlpha"
              >
                Busiest Time
              </Badge>
            )}
            {isCP ? (
              <Stat.Root>
                <Stat.Label fontSize="sm" color="gray.500">
                  {label}
                </Stat.Label>
                <HStack>
                  <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  <Badge colorPalette={(netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0) - safe(values["Prior Controllable Profit"])) >= 0 ? "green" : "red"} gap="0">
                    {(netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0) - safe(values["Prior Controllable Profit"])) >= 0 ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
                    {Math.abs(safe(values["Prior Controllable Profit"]) ? (((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Prior Controllable Profit"])) / safe(values["Prior Controllable Profit"]) * 100) : 0).toFixed(2)}%
                  </Badge>
                </HStack>
                {detail && (
                  <Stat.HelpText fontSize="xs" color="gray.500" mb="0">
                    {detail}
                  </Stat.HelpText>
                )}
                {delta && (
                  <Stat.HelpText fontSize="xs" color="gray.700" mb="0">
                    {delta}
                  </Stat.HelpText>
                )}
                {formula && (
                  <Stat.HelpText fontSize="xs" color="gray.400" mb="0">
                    {formula}
                  </Stat.HelpText>
                )}
              </Stat.Root>
            ) : (
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">
                  {label}
                </Text>
                <Text fontWeight="bold" color={color || "inherit"} fontSize="xl">
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
                {formula && (
                  <Text fontSize="xs" color="gray.400">
                    {formula}
                  </Text>
                )}
              </VStack>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Heading size="md" marginTop={8} marginBottom={4}>
        Labor Metrics
      </Heading>

      {/* spacing={6} добавляет отступ между карточками */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {laborMetrics.map(({ label, value, detail, delta, color, isBusiest, formula }, i) => (
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
                top={2}
                right={2}
                colorScheme="blackAlpha"
              >
                Busiest Time
              </Badge>
            )}
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500">
                {label}
              </Text>
              <Text fontWeight="bold" color={color || "inherit"} fontSize="xl">
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
              {formula && (
                <Text fontSize="xs" color="gray.400">
                  {formula}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
