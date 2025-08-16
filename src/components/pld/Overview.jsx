// src/components/pld/Overview.jsx
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
import { Chart, useChart } from "@chakra-ui/charts";
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip } from "recharts";
import { 
  calculateAllPLMetrics,
} from "../../utils/plCalculations.js";
import {
  buildSalesMetrics,
  buildFinancialMetrics,
  buildCPRCMetrics,
  buildFacilityMetrics,
  buildLaborMetrics,
  buildRestaurantContributionMetrics,
} from "../../utils/metricBuilders.js";

export default function Overview({ values, rows, actualIdx }) {
  if (!values || Object.keys(values).length === 0) return null;

  // Calculate all P&L metrics using utility functions
  const calculations = calculateAllPLMetrics(values, rows, actualIdx);
  
  // Build metric arrays using utility functions
  const salesMetrics = buildSalesMetrics(calculations);
  const financialMetrics = buildFinancialMetrics(calculations);
  const cpRCMetrics = buildCPRCMetrics(calculations, values);
  const facilityMetrics = buildFacilityMetrics(calculations);
  const laborMetrics = buildLaborMetrics(calculations);
  const rcMetrics = buildRestaurantContributionMetrics(calculations);

  return (
    <Box width="100%">
            {/* Top Row - 2 Cards using CSS Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", lg: "1fr 3fr" }}
        gap={{ base: 4, lg: 6 }}
        mb={8}
      >
        {/* Card 1 - Net Sales */}
        <Box
          bg="white"
          borderRadius="xl"
          shadow="md"
          p={6}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md">
              Net Sales
            </Heading>
            <Badge colorPalette={calculations.netSales.deltaPercent > 0 ? "green" : "red"} variant="subtle" px={3} py={1}>
              <HStack spacing={1}>
                <Text fontSize="xs">SSS%</Text>
                <Text fontSize="xs">{calculations.netSales.deltaPercent.toFixed(1)}%</Text>
              </HStack>
            </Badge>
          </Flex>
          <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
            ${calculations.netSales.actual.toLocaleString()}
          </Text>
          
          {/* Pie Chart */}
          <Box mb={4}>
            <Chart.Root boxSize="180px" mx="auto" chart={useChart({
              data: [
                { name: "COGS", value: calculations.percentages.cogs, color: (calculations.percentages.cogs / calculations.netSales.actual * 100) > 30 ? "red" : "green" },
                { name: "Labor", value: calculations.labor.totalLabor, color: (calculations.labor.totalLabor / calculations.netSales.actual * 100) > 30 ? "red" : "green" },
                { name: "CP", value: calculations.cp.cp, color: "teal" },
                { name: "Other", value: calculations.netSales.actual - calculations.percentages.cogs - calculations.labor.totalLabor - calculations.cp.cp, color: "gray" },
              ],
            })}>
              <PieChart>
                <Pie
                  isAnimationActive={false}
                  data={[
                    { name: "COGS", value: calculations.percentages.cogs, color: (calculations.percentages.cogs / calculations.netSales.actual * 100) > 30 ? "red" : "green" },
                    { name: "Labor", value: calculations.labor.totalLabor, color: (calculations.labor.totalLabor / calculations.netSales.actual * 100) > 30 ? "red" : "green" },
                    { name: "CP", value: calculations.cp.cp, color: "teal" },
                    { name: "Other", value: calculations.netSales.actual - calculations.percentages.cogs - calculations.labor.totalLabor - calculations.cp.cp, color: "gray" },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${((value / calculations.netSales.actual) * 100).toFixed(1)}%`}
                >
                  {[
                    { name: "COGS", value: calculations.percentages.cogs, color: (calculations.percentages.cogs / calculations.netSales.actual * 100) > 30 ? "red" : "green" },
                    { name: "Labor", value: calculations.labor.totalLabor, color: (calculations.labor.totalLabor / calculations.netSales.actual * 100) > 30 ? "red" : "green" },
                    { name: "CP", value: calculations.cp.cp, color: "teal" },
                    { name: "Other", value: calculations.netSales.actual - calculations.percentages.cogs - calculations.labor.totalLabor - calculations.cp.cp, color: "gray" },
                  ].map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </Chart.Root>
          </Box>
        </Box>

        {/* Card 2 - Combined Sales Metrics using nested Grid */}
        <Box
          bg="white"
          borderRadius="xl"
          shadow="md"
          p={6}
        >
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
            gap={{ base: 4, lg: 6 }}
          >
            {/* Column 1 - Sales Overview */}
            <Box>
              <Heading size="md" mb={3}>
                Sales Overview
              </Heading>
              <VStack spacing={{ base: 3, lg: 4 }} align="stretch" divideY="1px">
                {salesMetrics.filter(metric => metric.label === "Net Sales").map(({ label, value, detail, delta, color, formula }, i) => (
                  <Stat.Root key={i} p={2}>
                    <Stat.Label fontSize="xs" color="gray.500">
                      {label}
                    </Stat.Label>
                    <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="md">
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
                  </Stat.Root>
                ))}
              </VStack>
            </Box>
            
            {/* Column 2 - Transactions */}
            <Box>
              <Heading size="md" mb={3}>
                Transactions
              </Heading>
              <VStack spacing={{ base: 3, lg: 4 }} align="stretch" divideY="1px">
                {salesMetrics.filter(metric => metric.label === "SST%").map(({ label, value, detail, delta, color, formula }, i) => (
                  <Stat.Root key={i} p={2}>
                    <Stat.Label fontSize="xs" color="gray.500">
                      {label}
                    </Stat.Label>
                    <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="md">
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
                  </Stat.Root>
                ))}
              </VStack>
            </Box>
            
            {/* Column 3 - Check Average */}
            <Box>
              <Heading size="md" mb={3}>
                Check Average
              </Heading>
              <VStack spacing={{ base: 3, lg: 4 }} align="stretch" divideY="1px">
                {salesMetrics.filter(metric => ["Check Average", "OLO %"].includes(metric.label)).map(({ label, value, detail, delta, color, formula }, i) => (
                  <Stat.Root key={i} p={2}>
                    <Stat.Label fontSize="xs" color="gray.500">
                      {label}
                    </Stat.Label>
                    <Stat.ValueText fontWeight="bold" color={color || "inherit"} fontSize="md">
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
                  </Stat.Root>
                ))}
              </VStack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Alternative DataList view for Labor Metrics */}
      <Flex 
        direction={{ base: "column", lg: "row" }}
        gap={6}
        flexWrap="wrap"
        justify="space-between"
      >
        {/* Sales Metrics Card */}
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
              {salesMetrics.map(({ label, value, detail, delta, color, formula }, i) => (
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
                </Stat.Root>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Financial Metrics Card */}
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
              {financialMetrics.map(({ label, value, detail, delta, color, formula }, i) => (
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

        {/* CP & RC Metrics Card */}
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
              {cpRCMetrics.map(({ label, value, detail, delta, color, formula, isCP }, i) => (
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
              {rcMetrics.map(({ label, value, formula }, i) => (
                <Stat.Root key={i} p={3}>
                  <Stat.Label fontSize="sm" color="gray.500">
                    {label}
                  </Stat.Label>
                  <Stat.ValueText fontWeight="bold" fontSize="xl">
                    {value}
                  </Stat.ValueText>
                  <Text fontSize="xs" color="gray.400" mt="1">
                    {formula}
                  </Text>
                </Stat.Root>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Facility Metrics Card */}
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
