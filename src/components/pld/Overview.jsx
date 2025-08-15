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
  DataList,
  Flex,
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
    {
      label: "Net Sales",
      value: `Act: $${netSales.toLocaleString()}`,
      detail: `Pri: $${safe(values["Prior Net Sales"]).toLocaleString()}`,
      delta: `Δ $${(netSales - safe(values["Prior Net Sales"])).toLocaleString()} (${((netSales - safe(values["Prior Net Sales"])) / safe(values["Prior Net Sales"]) * 100 || 0).toFixed(2)}%)`,
      color: (netSales - safe(values["Prior Net Sales"])) >= 0 ? "green.500" : "red.500",
      formula: "(Actual Net Sales - Prior Net Sales) / Prior Net Sales * 100",
    },
    {
      label: "SST%",
      value: `${((transactions - safe(values["Prior Total Transactions"])) / safe(values["Prior Total Transactions"]) * 100 || 0).toFixed(2)}%`,
      detail: `This Year: ${transactions.toLocaleString()}`,
      delta: `Last Year: ${safe(values["Prior Total Transactions"]).toLocaleString()}`,
      color: ((transactions - safe(values["Prior Total Transactions"])) / safe(values["Prior Total Transactions"]) * 100 || 0) >= 0 ? "green.500" : "red.500",
      formula: "(This Year Existing Store Transactions – Last Year Existing Store Transactions)/Last Year Existing Store Transactions",
    },
    { 
      label: "Check Average", 
      value: `$${checkAvg.toFixed(2)}`,
      formula: "Net Sales / Total Transactions",
    },
    { 
      label: "Total Transactions", 
      value: `${transactions}`,
      formula: "Total Transactions",
    },
    { 
      label: "OLO %", 
      value: `${oloPercent.toFixed(2)}%`,
      formula: "(3rd Party + Panda Digital) / Net Sales * 100",
    },

  ];

  // Financial metrics array
  const financialMetrics = [
    {
      label: "Prime Cost",
      value: `${primeCost.toFixed(2)}%`,
      color: primeCost > 60 ? "red.500" : "green.500",
      formula: "COGS % + Labor %",
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

  // Facility metrics array
  const facilityMetrics = [
    {
      label: "Rent Total",
      value: `Act: $${rentActual.toLocaleString()}`,
      detail: `Pri: $${rentPrior.toLocaleString()}`,
      delta: `Δ $${rentDiff.toLocaleString()} (${rentPctDiff.toFixed(2)}%)`,
      isRent: true,
      formula: "Rent - MIN + Storage + Percent + Other + Deferred",
    },
    {
      label: "Repairs",
      value: `Act: $${repairsAct.toLocaleString()}`,
      detail: `Pri: $${repairsPri.toLocaleString()}`,
      delta: `Δ $${repairsDiff.toLocaleString()} (${repairsPct.toFixed(2)}%)`,
      isRepairs: true,
      formula: "Repairs (Actual vs Prior)",
    },
    {
      label: "Maintenance",
      value: `Act: $${maintAct.toLocaleString()}`,
      detail: `Pri: $${maintPri.toLocaleString()}`,
      delta: `Δ $${maintDiff.toLocaleString()} (${maintPct.toFixed(2)}%)`,
      isMaintenance: true,
      formula: "Maintenance (Actual vs Prior)",
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
 

     
      {/* Alternative DataList view for Labor Metrics */}
      <Flex 
        direction={{ base: "column", lg: "row" }}
        gap={6}
        flexWrap="wrap"
        justify="space-between"
      >


        {/* Key Metrics DataList Card */}
        <Box
          bg="white"
          borderRadius="xl"
          shadow="md"
          p={6}
          position="relative"
          overflow="hidden"
          flex={{ base: "1", lg: "1" }}
          minW={{ base: "100%", lg: "300px" }}
          maxW={{ base: "100%", lg: "calc(33.333% - 12px)" }}
        >
          
          <Heading size="md" marginBottom={4}>
            Sales
          </Heading>
          
          <Box p={4}>
            <VStack spacing={6} align="stretch" divideY="2px">
              {metrics.map(({ label, value, detail, delta, color, isBusiest, formula }, i) => (
                <Stat.Root key={i} p={3}>
                  <Stat.Label fontSize="sm" color="gray.500">
                    {label}
                  </Stat.Label>
                  <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  {detail && (
                    <Text fontSize="xs" color="gray.500" mt="1">
                      {detail}
                    </Text>
                  )}
                  {delta && (
                    <HStack spacing={2} mt="1">
                      <Text fontSize="xs" color="gray.700">
                        {delta}
                      </Text>
                      {delta.includes('Δ') && (
                        <Badge colorPalette={delta.includes('-') ? "red" : "green"} variant="plain" px="0">
                          {delta.includes('-') ? <Stat.DownIndicator /> : <Stat.UpIndicator />}
                        </Badge>
                      )}
                    </HStack>
                  )}
                  {formula && (
                    <Text fontSize="xs" color="gray.400" mt="1">
                      {formula}
                    </Text>
                  )}
                  {isBusiest && (
                    <Badge colorScheme="orange" size="sm" mt="1">
                      Busiest Time
                    </Badge>
                  )}
                </Stat.Root>
              ))}
            </VStack>
          </Box>
        </Box>



        {/* Financial Metrics DataList Card */}
        <Box
          bg="white"
          borderRadius="xl"
          shadow="md"
          p={6}
          position="relative"
          overflow="hidden"
          flex={{ base: "1", lg: "1" }}
          minW={{ base: "100%", lg: "300px" }}
          maxW={{ base: "100%", lg: "calc(33.333% - 12px)" }}
        >
          <Heading size="md" marginBottom={4}>
            Financials
          </Heading>
          
          <Box p={4}>
            <VStack spacing={6} align="stretch" divideY="2px">
              {financialMetrics.map(({ label, value, detail, delta, color, formula, isBusiest }, i) => (
                <Stat.Root key={i} p={3}>
                  <Stat.Label fontSize="sm" color="gray.500">
                    {label}
                  </Stat.Label>
                  <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  {detail && (
                    <Text fontSize="xs" color="gray.500" mt="1">
                      {detail}
                    </Text>
                  )}
                  {delta && (
                    <Text fontSize="xs" color="gray.700" mt="1">
                      {delta}
                    </Text>
                  )}
                  {isBusiest && (
                    <Badge colorScheme="orange" size="sm" mt="1">
                      Busiest Time
                    </Badge>
                  )}
                  {formula && (
                    <Text fontSize="xs" color="gray.400" mt="1">
                      {formula}
                    </Text>
                  )}
                </Stat.Root>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Controllable Profit Metrics DataList Card */}
        <Box
          bg="white"
          borderRadius="xl"
          shadow="md"
          p={6}
          position="relative"
          overflow="hidden"
          flex={{ base: "1", lg: "1" }}
          minW={{ base: "100%", lg: "300px" }}
          maxW={{ base: "100%", lg: "calc(33.333% - 12px)" }}
        >
          <Heading size="md" marginBottom={4}>
            CP & RC
          </Heading>
          
          {/* First box - Main CP metrics */}
          <Box p={4}>
            <VStack spacing={6} align="stretch" divideY="2px">
              {cpMetrics.map(({ label, value, detail, delta, color, formula, isCP }, i) => (
                <Stat.Root key={i} p={3}>
                  <Stat.Label fontSize="sm" color="gray.500">
                    {label}
                  </Stat.Label>
                  <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  {detail && (
                    <Text fontSize="xs" color="gray.500" mt="1">
                      {detail}
                    </Text>
                  )}
                  {delta && (
                    <Text fontSize="xs" color="gray.700" mt="1">
                      {delta}
                    </Text>
                  )}
                  {formula && (
                    <Text fontSize="xs" color="gray.400" mt="1">
                      {formula}
                    </Text>
                  )}
                </Stat.Root>
              ))}
            </VStack>
          </Box>
          
          {/* Second box - Restaurant Contribution */}
          <Box p={4} mt={4}>
            <VStack spacing={6} align="stretch" divideY="2px">
              <Stat.Root p={3}>
                <Stat.Label fontSize="sm" color="gray.500">
                  Restaurant Contribution
                </Stat.Label>
                <Stat.ValueText fontWeight="bold" fontSize="xl">
                  ${((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Total Fixed Cost"])).toLocaleString()}
                </Stat.ValueText>
                <Text fontSize="xs" color="gray.400" mt="1">
                  CP - Fixed Cost
                </Text>
              </Stat.Root>
              <Stat.Root p={3}>
                <Stat.Label fontSize="sm" color="gray.500">
                  Restaurant Contribution %
                </Stat.Label>
                <Stat.ValueText fontWeight="bold" fontSize="xl">
                  ${(((netSales - safe(values["Cost of Goods Sold"]) - safe(values["Total Labor"]) - safe(values["Total Controllables"]) - safe(values["Advertising"] || 0)) - safe(values["Total Fixed Cost"])) / netSales * 100).toFixed(2)}%
                </Stat.ValueText>
                <Text fontSize="xs" color="gray.400" mt="1">
                  RC / Net Sales * 100
                </Text>
              </Stat.Root>
            </VStack>
          </Box>
        </Box>



        {/* Facility Metrics DataList Card */}
        <Box
          bg="white"
          borderRadius="xl"
          shadow="md"
          p={6}
          position="relative"
          overflow="hidden"
          flex={{ base: "1", lg: "1" }}
          minW={{ base: "100%", lg: "300px" }}
          maxW={{ base: "100%", lg: "calc(33.333% - 12px)" }}
        >
          <Heading size="md" marginBottom={4}>
            Facility
          </Heading>
          
          <Box p={4}>
            <VStack spacing={6} align="stretch" divideY="2px">
              {facilityMetrics.map(({ label, value, detail, delta, color, formula, isRent, isRepairs, isMaintenance }, i) => (
                <Stat.Root key={i} p={3}>
                  <Stat.Label fontSize="sm" color="gray.500">
                    {label}
                  </Stat.Label>
                  <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  {detail && (
                    <Text fontSize="xs" color="gray.500" mt="1">
                      {detail}
                    </Text>
                  )}
                  {delta && (
                    <Text fontSize="xs" color="gray.700" mt="1">
                      {delta}
                    </Text>
                  )}
                  {formula && (
                    <Text fontSize="xs" color="gray.400" mt="1">
                      {formula}
                    </Text>
                  )}
                </Stat.Root>
              ))}
            </VStack>
          </Box>
        </Box>
      </Flex>
      
      {/* Labor Metrics as full-width card below */}
      <Box
        bg="white"
        borderRadius="xl"
        shadow="md"
        borderWidth="1px"
        borderColor="blue.200"
        p={6}
        position="relative"
        overflow="hidden"
        mt={6}
        width="100%"
      >
        {/* Blue accent bar at top */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="4px"
          bgGradient="linear(to-r, blue.400, blue.600)"
        />
        
        <Heading size="md" marginBottom={4} color="blue.600">
          Labor Metrics (DataList View)
        </Heading>
        
        <Box p={4}>
          <SimpleGrid columns={4} gap={4}>
            {laborMetrics.map(({ label, value, detail, delta, color, formula }, i) => (
              <Box key={i} textAlign="left">
                <Text fontSize="sm" color="gray.500" mb={2}>
                  {label}
                </Text>
                <Text fontWeight="bold" color={color || "inherit"} fontSize="xl" mb={1}>
                  {value}
                </Text>
                {formula && (
                  <Text fontSize="xs" color="gray.400">
                    {formula}
                  </Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}
