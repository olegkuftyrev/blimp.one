// src/pages/SMG.jsx
import React, { useState } from "react";
import { Box, Text, Input, Table, VStack, HStack, Grid, Button, Tooltip, Flex } from "@chakra-ui/react";
import * as XLSX from "xlsx";

// Helper functions for calculations
const calculateDifference = (current, target) => {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return null;
  return Number((current - target).toFixed(1));
};

const calculateSurveysNeeded = (currentScore, targetScore, totalSurveys) => {
  if (!Number.isFinite(currentScore) || !Number.isFinite(targetScore) || !Number.isFinite(totalSurveys)) return null;
  if (currentScore >= targetScore) return null; // Target already met
  if (targetScore >= 100) return null; // Impossible target
  
  // EXACT EXCEL FORMULA: (D2-C2)/100*B2/(1-(D2/100))+0.5
  // Where: D2=target, C2=current, B2=surveys
  const scoreDifference = targetScore - currentScore;
  const calculation = (scoreDifference / 100) * totalSurveys / (1 - (targetScore / 100)) + 0.5;
  
  // Round to nearest integer (Excel behavior)
  const additionalNeeded = Math.round(calculation);
  
  return additionalNeeded > 0 ? additionalNeeded : null;
};

const getDifferenceStyle = (difference) => {
  if (!Number.isFinite(difference)) return {};
  if (difference > 0) return { bg: "green.500", color: "white" };
  if (difference < 0) return { bg: "red.500", color: "white" };
  return {};
};

// Hardcoded targets for each store
const STORE_TARGETS = {
  "329": { tof: 57.6, osat: 60.0 },
  "574": { tof: 55.2, osat: 53.7 },
  "1073": { tof: 58.3, osat: 57.6 },
  "1088": { tof: 56.0, osat: 57.2 },
  "1291": { tof: 56.8, osat: 56.6 },
  "1973": { tof: 46.6, osat: 46.1 },
  "2014": { tof: 53.3, osat: 48.7 },
  "2044": { tof: 61.9, osat: 66.6 },
  "2226": { tof: 59.4, osat: 59.8 },
  "2662": { tof: 67.4, osat: 65.1 },
  "2757": { tof: 55.7, osat: 53.5 },
  "3078": { tof: 54.1, osat: 53.6 },
  "1161": { tof: 56.5, osat: 55.2 },
  "1272": { tof: 57.6, osat: 64.3 },
  "1505": { tof: 53.6, osat: 53.2 },
  "1911": { tof: 56.3, osat: 55.0 },
  "1950": { tof: 62.3, osat: 62.0 },
  "1961": { tof: 68.8, osat: 59.6 },
  "2154": { tof: 59.7, osat: 54.2 },
  "2261": { tof: 54.8, osat: 55.8 },
  "2475": { tof: 44.7, osat: 47.0 },
  "2874": { tof: 59.0, osat: 59.0 },
  "3317": { tof: 53.0, osat: 52.0 },
  "3471": { tof: 58.9, osat: 59.1 },
  "3698": { tof: 69.0, osat: 60.1 },
  "599": { tof: 65.5, osat: 67.1 },
  "1423": { tof: 63.2, osat: 63.5 },
  "1449": { tof: 64.1, osat: 62.2 },
  "1596": { tof: 63.2, osat: 69.4 },
  "2527": { tof: 63.5, osat: 63.0 },
  "815": { tof: 66.5, osat: 66.3 },
  "1080": { tof: 57.7, osat: 55.3 },
  "1182": { tof: 58.9, osat: 56.9 },
  "1220": { tof: 58.2, osat: 57.2 },
  "1495": { tof: 61.1, osat: 58.8 },
  "1670": { tof: 59.2, osat: 58.9 },
  "1708": { tof: 65.8, osat: 61.9 },
  "2047": { tof: 58.1, osat: 57.4 },
  "2128": { tof: 71.9, osat: 71.7 },
  "2129": { tof: 66.0, osat: 65.5 },
  "2875": { tof: 62.5, osat: 61.3 },
  "2966": { tof: 57.4, osat: 57.6 },
  "3544": { tof: 64.1, osat: 63.5 },
  "817": { tof: 67.4, osat: 70.3 },
  "1020": { tof: 56.7, osat: 57.0 },
  "1094": { tof: 55.4, osat: 54.8 },
  "1105": { tof: 58.7, osat: 58.2 },
  "1183": { tof: 58.0, osat: 56.4 },
  "1209": { tof: 52.6, osat: 54.5 },
  "1235": { tof: 53.9, osat: 53.5 },
  "1270": { tof: 59.5, osat: 58.2 },
  "1535": { tof: 57.0, osat: 57.4 },
  "1672": { tof: 64.4, osat: 63.2 },
  "2015": { tof: 56.0, osat: 55.1 },
  "2386": { tof: 60.4, osat: 60.2 },
  "3422": { tof: 56.5, osat: 55.5 },
  "3496": { tof: 62.2, osat: 63.6 },
  "3783": { tof: 65.0, osat: 64.6 },
  "566": { tof: 58.8, osat: 56.5 },
  "708": { tof: 56.6, osat: 55.1 },
  "884": { tof: 63.0, osat: 61.3 },
  "1016": { tof: 57.5, osat: 58.1 },
  "1024": { tof: 57.6, osat: 58.2 },
  "1074": { tof: 52.8, osat: 51.0 },
  "1219": { tof: 55.5, osat: 53.2 },
  "1232": { tof: 57.6, osat: 58.2 },
  "1564": { tof: 54.2, osat: 53.1 },
  "1709": { tof: 65.5, osat: 62.1 },
  "1725": { tof: 56.2, osat: 55.1 },
  "1881": { tof: 61.6, osat: 61.1 },
  "2605": { tof: 56.7, osat: 55.2 },
  "3829": { tof: 64.5, osat: 64.6 }
};

// Function to get targets for a store, with defaults if not found
const getStoreTargets = (storeNumber) => {
  const cleanStoreNumber = String(storeNumber).replace(/^0+/, ''); // Remove leading zeros
  const targets = STORE_TARGETS[cleanStoreNumber];
  
  if (targets) {
    return { ...targets, isDefault: false };
  } else {
    return { tof: 65.0, osat: 65.0, isDefault: true };
  }
};

// Store area groupings
const STORE_AREAS = {
  "Aaron": ["329", "574", "1073", "1088", "1291", "1973", "2014", "2044", "2226", "2662", "2757", "3078"],
  "Josie": ["1161", "1272", "1505", "1911", "1950", "1961", "2154", "2261", "2475", "2874", "3317", "3471", "3698"],
  "Lam": ["599", "1423", "1449", "1596", "2527"],
  "Oscar": ["815", "1080", "1182", "1220", "1495", "1670", "1708", "2047", "2128", "2129", "2875", "2966", "3544"],
  "Sam": ["817", "1020", "1094", "1105", "1183", "1209", "1235", "1270", "1535", "1672", "2015", "2386", "3422", "3496", "3783"],
  "Simon": ["1650", "1649", "566", "708", "884", "1016", "1024", "1074", "1219", "1232", "1564", "1709", "1725", "1881", "2605", "3829"],
  "YoungYeo": ["1090", "1164", "1995", "2630", "2768", "2854", "2876", "3091", "3517", "3635"],
  "Emanuel Silva": ["1172", "1377", "1597", "2669", "2866", "3055", "3418", "3499", "3680", "3844"],
};

// Function to get area for a store
const getStoreArea = (storeNumber) => {
  const cleanStoreNumber = String(storeNumber).replace(/^0+/, ''); // Remove leading zeros
  
  for (const [area, stores] of Object.entries(STORE_AREAS)) {
    if (stores.includes(cleanStoreNumber)) {
      return area;
    }
  }
  
  return "Region"; // Default for unknown stores
};

// Function to get performance priority for sorting (green=1, orange=2, red=3)
const getPerformancePriority = (row) => {
  const meetsToF = row.tofDifference >= 0;
  const meetsOSAT = row.osatDifference >= 0;
  
  if (meetsToF && meetsOSAT) {
    return 1; // Green - highest priority
  } else if (!meetsToF && !meetsOSAT) {
    return 3; // Red - lowest priority
  } else {
    return 2; // Orange - medium priority
  }
};

export default function SMG() {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  async function handleFileUpload(e) {
    setErr("");
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      
      // Get the first sheet
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      
      if (!sheet) throw new Error('No sheet found');

      // Convert to array of arrays
      const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
      
      console.log("Raw Excel data:", aoa); // Debug: see what we're actually reading
      
      // Find the header row (look for "Store" and "Count" columns)
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(10, aoa.length); i++) {
        const row = aoa[i] || [];
        const rowStr = row.map(cell => String(cell || "").toLowerCase());
        if (rowStr.includes("store") && rowStr.includes("count")) {
          headerRowIndex = i;
          break;
        }
      }

      console.log("Header row index:", headerRowIndex); // Debug
      console.log("Headers found:", aoa[headerRowIndex]); // Debug

      // Extract headers and data
      const rawHeaders = aoa[headerRowIndex] || [];
      const rawDataRows = aoa.slice(headerRowIndex + 1).filter(row => row && row.length > 0);

      console.log("Data rows:", rawDataRows); // Debug

      // Process the data to create smart report
      const processedRows = rawDataRows.map(row => {
          console.log("Processing row:", row); // Debug each row
          console.log("All column values:", row); // Debug: show all columns
          console.log("Column mapping check:", {
            "Column 0 (Store Number)": row[0],
            "Column 1 (Store Name)": row[1], 
            "Column 2 (Count)": row[2],
            "Column 3 (OSAT Score)": row[3],
            "Column 4 (OSAT n)": row[4],
            "Column 5 (ToF Score)": row[5],
            "Column 6 (ToF n)": row[6],
            "Column 7": row[7],
            "Column 8": row[8],
            "Column 9": row[9],
            "Column 10": row[10]
          });
          
          // Extract values from the row - based on your screenshot structure
          const storeNumber = row[0]; // Column A - Store Number (e.g., "00329")
          const storeName = row[1];   // Column B - Store Name (e.g., "ALDERWOOD MALL PX")
          const count = Number(row[2]); // Column C - Count (e.g., 18)
          
          // For the scores, check if they're already percentages or decimals
          let overallSatisfactionScore = Number(row[3]);
          let tasteOfFoodScore = Number(row[5]);
          
          // If scores are less than 1, they're decimals and need conversion to percentage
          if (overallSatisfactionScore < 1 && overallSatisfactionScore > 0) {
            overallSatisfactionScore = overallSatisfactionScore * 100;
          }
          if (tasteOfFoodScore < 1 && tasteOfFoodScore > 0) {
            tasteOfFoodScore = tasteOfFoodScore * 100;
          }
          
          const overallSatisfactionN = Number(row[4]); // Column E - Overall Satisfaction n
          const tasteOfFoodN = Number(row[6]); // Column G - Taste of Food n

          // Get targets from hardcoded values
          const storeTargets = getStoreTargets(storeNumber);
          const tofTarget = storeTargets.tof;
          const osatTarget = storeTargets.osat;

          // Get area for the store
          const storeArea = getStoreArea(storeNumber);

          // Calculate differences
          const tofDifference = calculateDifference(tasteOfFoodScore, tofTarget);
          const osatDifference = calculateDifference(overallSatisfactionScore, osatTarget);

          // Calculate surveys needed - FIXED CALCULATION
          // Based on your screenshot, the calculation seems to use a different base
          // Let me try a more sophisticated approach
          const tofSurveysNeeded = calculateSurveysNeeded(tasteOfFoodScore, tofTarget, count);
          const osatSurveysNeeded = calculateSurveysNeeded(overallSatisfactionScore, osatTarget, count);

          return {
            storeNumber,
            storeName,
            storeArea,
            count,
            ptdTasteOfFood: tasteOfFoodScore,
            tofTarget,
            tofDifference,
            tofSurveysNeeded,
            ptdOsat: overallSatisfactionScore,
            osatTarget,
            osatDifference,
            osatSurveysNeeded,
            isDefaultTarget: storeTargets.isDefault
          };
        });

      console.log("Processed rows:", processedRows); // Debug final result
      setData(processedRows);

    } catch (ex) {
      console.error(ex);
      setErr("Failed to read file. Please check that you're uploading the correct Excel file.");
      setData([]);
    }
  }

  // Calculate region-wide metrics
  const regionToF = data.length > 0 ? data.filter(row => row.tofDifference >= 0).length / data.length * 100 : 0;
  const regionOSAT = data.length > 0 ? data.filter(row => row.osatDifference >= 0).length / data.length * 100 : 0;
  const regionAvg = (regionToF + regionOSAT) / 2;

  // Smart report headers - matching your screenshot exactly
  const smartHeaders = [
    "Area",
    "Store Number",
    "Store Name", 
    "# of PTD Survey",
    "PTD Taste of Food",
    "ToF 2025 Target",
    "PTD ToF vs 2025 Target",
    "# Highly Satisfied Surveys To Meet ToF",
    "PTD OSAT",
    "2025 Target",
    "PTD OSAT vs 2025 Target",
    "# Highly Satisfied Surveys To Meet OSAT"
  ];

  return (
    <Box p={{ base: 2, md: 4 }} mx="auto" maxW="100vw">
      <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
        {/* File Upload Section */}
        <Box
          w="100%"
          bg="white"
          p={8}
          rounded="2xl"
          shadow="lg"
          borderWidth="2px"
          borderColor="blue.200"
          borderStyle="dashed"
          textAlign="center"
          position="relative"
          overflow="hidden"
          _hover={{
            borderColor: "blue.300",
            transform: "translateY(-2px)",
            shadow: "xl"
          }}
          transition="all 0.3s ease"
        >
          {/* Background accent */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="6px"
            bgGradient="linear(to-r, blue.500, purple.600)"
          />
          
          {/* Upload Icon */}
          <Box mb={6}>
            <Box
              w="20"
              h="20"
              mx="auto"
              bg="blue.50"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={4}
            >
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </Box>
          </Box>
          
          {/* Upload Text */}
          <VStack spacing={3}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {data.length > 0 ? "Re-Upload your file" : "Upload Your Excel File"}
            </Text>
            <Text fontSize="md" color="gray.600" maxW="400px">
              {data.length > 0 
                ? "Upload a new file to replace the current data"
                : "Drag and drop your .xls file here, or click to browse and select your file"
              }
            </Text>
          </VStack>
          
          {/* File Input */}
          <Box position="relative">
            <Input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              opacity="0"
              cursor="pointer"
              zIndex="1"
            />
            <Button
              size="lg"
              colorScheme="blue"
              variant="solid"
              px={8}
              py={4}
              fontSize="md"
              fontWeight="semibold"
              rounded="xl"
              shadow="md"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg"
              }}
              transition="all 0.2s"
            >
              Choose File
            </Button>
          </Box>
          
          {/* File Type Info */}
          <HStack spacing={2} color="gray.500" fontSize="sm">
            <Box w="2" h="2" bg="blue.400" rounded="full" />
            <Text>Supports .xls and .xlsx files</Text>
          </HStack>
        </Box>

        {data.length > 0 && (
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Performance Summary by Area */}
            <Box 
              bg="white" 
              p={6} 
              rounded="2xl" 
              shadow="lg" 
              borderWidth="1px" 
              borderColor="blue.100"
              mb={8}
              position="relative"
              overflow="hidden"
            >
              {/* Background accent */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="6px"
                bgGradient="linear(to-r, blue.500, purple.600)"
              />
              
              {/* Header Section */}
              <VStack align="center" spacing={4} mb={6}>
                <HStack spacing={3} align="center">
                  <Box
                    w="16px"
                    h="16px"
                    rounded="full"
                    bgGradient="linear(to-r, blue.500, purple.600)"
                    flexShrink={0}
                  />
                  <VStack align="center" spacing={1}>
                    <Text
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="800"
                      color="gray.800"
                      letterSpacing="tight"
                      textAlign="center"
                    >
                      Performance Summary by Area
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      fontWeight="500"
                      textAlign="center"
                    >
                      Overview of target achievement across all store areas
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
              
              {/* Region Performance Overview */}
              <Box mb={6}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4} textAlign="center">
                  Region Performance Overview
                </Text>
                <Flex 
                  direction={{ base: "column", lg: "row" }}
                  align="center" 
                  spacing={6} 
                  w="100%"
                  gap={6}
                >
                  {/* Left Column - Gauge Chart and KPIs */}
                  <Box flex="1" minW="300px">
                    <VStack align="center" spacing={4}>
                      {/* Region Average Gauge */}
                      <Box position="relative" w="200px" h="200px">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          {/* Background circle */}
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="20"
                          />
                          {/* Performance arc */}
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="20"
                            strokeDasharray={`${regionAvg * 5.03} 502.65`}
                            strokeDashoffset="125.66"
                            transform="rotate(-90 100 100)"
                          />
                        </svg>
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          textAlign="center"
                        >
                          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            {regionAvg.toFixed(1)}%
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Region Avg
                          </Text>
                        </Box>
                      </Box>
                      
                      {/* Key Performance Indicators */}
                      <HStack spacing={6} justify="center">
                        <VStack spacing={1} align="center">
                          <Text fontSize="sm" color="gray.500">Total Stores</Text>
                          <Text fontSize="lg" fontWeight="bold" color="gray.800">
                            {data.length}
                          </Text>
                        </VStack>
                        <VStack spacing={1} align="center">
                          <Text fontSize="sm" color="gray.500">ToF Target</Text>
                          <Text fontSize="lg" fontWeight="bold" color="red.600">
                            {regionToF.toFixed(1)}%
                          </Text>
                        </VStack>
                        <VStack spacing={1} align="center">
                          <Text fontSize="sm" color="gray.500">OSAT Target</Text>
                          <Text fontSize="lg" fontWeight="bold" color="red.600">
                            {regionOSAT.toFixed(1)}%
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                  
                  {/* Right Column - Performance Insight Cards */}
                  <Box flex="2" minW={{ base: "100%", lg: "600px" }}>
                    {/* First Row */}
                    <Flex 
                      direction={{ base: "column", md: "row" }}
                      gap={{ base: 3, md: 3 }}
                      w="100%"
                      mb={4}
                      flexWrap="wrap"
                    >
                      {/* Top Performers */}
                      <Box bg="green.50" p={4} rounded="lg" borderWidth="1px" borderColor="green.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="green.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="green.700">
                              Top Performers
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="green.600" textAlign="left">
                            {(() => {
                              const topPerformers = data.filter(row => row.tofDifference >= 0 && row.osatDifference >= 0).length;
                              return `${topPerformers} stores meeting both targets`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                      
                      {/* Meet ToF */}
                      <Box bg="green.50" p={4} rounded="lg" borderWidth="1px" borderColor="green.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="green.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="green.700">
                              Meet ToF
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="green.600" textAlign="left">
                            {(() => {
                              const meetToF = data.filter(row => row.tofDifference >= 0).length;
                              return `${meetToF} stores`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                      
                      {/* Meet OSAT */}
                      <Box bg="green.50" p={4} rounded="lg" borderWidth="1px" borderColor="green.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="green.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="green.700">
                              Meet OSAT
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="green.600" textAlign="left">
                            {(() => {
                              const meetOSAT = data.filter(row => row.osatDifference >= 0).length;
                              return `${meetOSAT} stores`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                      
                      {/* Close to Target */}
                      <Box bg="orange.50" p={4} rounded="lg" borderWidth="1px" borderColor="orange.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="orange.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="orange.700">
                              Close to Target
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="orange.600" textAlign="left">
                            {(() => {
                              const closeToTarget = data.filter(row => 
                                (row.tofDifference >= -5 && row.tofDifference < 0) || 
                                (row.osatDifference >= -5 && row.osatDifference < 0)
                              ).length;
                              return `${closeToTarget} stores within 5% of target`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                    </Flex>
                    
                    {/* Second Row */}
                    <Flex 
                      direction={{ base: "column", md: "row" }}
                      gap={{ base: 3, md: 3 }}
                      w="100%"
                      flexWrap="wrap"
                    >
                      {/* Needs Attention */}
                      <Box bg="red.50" p={4} rounded="lg" borderWidth="1px" borderColor="red.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="red.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="red.700">
                              Needs Attention
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="red.600" textAlign="left">
                            {(() => {
                              const needsAttention = data.filter(row => row.tofDifference < 0 && row.osatDifference < 0).length;
                              return `${needsAttention} stores missing both targets`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                      
                      {/* Didn't meet ToF */}
                      <Box bg="red.50" p={4} rounded="lg" borderWidth="1px" borderColor="red.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="red.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="red.700">
                              Didn't meet ToF
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="red.600" textAlign="left">
                            {(() => {
                              const didntMeetToF = data.filter(row => row.tofDifference < 0).length;
                              return `${didntMeetToF} stores`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                      
                      {/* Didn't meet OSAT */}
                      <Box bg="red.50" p={4} rounded="lg" borderWidth="1px" borderColor="red.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="red.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="red.700">
                              Didn't meet OSAT
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="red.600" textAlign="left">
                            {(() => {
                              const didntMeetOSAT = data.filter(row => row.osatDifference < 0).length;
                              return `${didntMeetOSAT} stores`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                      
                      {/* Mixed Performance */}
                      <Box bg="blue.50" p={4} rounded="lg" borderWidth="1px" borderColor="blue.200" flex={{ base: "1", md: "1" }} minW={{ base: "100%", md: "200px" }}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2} align="center">
                            <Box w="3" h="3" bg="blue.500" rounded="full" />
                            <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                              Mixed Performance
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="blue.600" textAlign="left">
                            {(() => {
                              const mixed = data.filter(row => 
                                (row.tofDifference >= 0 && row.osatDifference < 0) || 
                                (row.tofDifference < 0 && row.osatDifference >= 0)
                              ).length;
                              return `${mixed} stores meeting one target`;
                            })()}
                          </Text>
                        </VStack>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
              
              {/* Summary Table */}
              <Box 
                overflow="auto" 
                borderWidth="1px" 
                borderColor="gray.200"
                rounded="xl"
                shadow="sm"
                bg="gray.50"
                sx={{
                  '&::-webkit-scrollbar': {
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'gray.100',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray.400',
                    borderRadius: '4px',
                  },
                }}
              >
                <Table.Root size={{ base: "sm", md: "md" }} variant="simple">
                  <Table.Header>
                    <Table.Row bg="white" borderBottom="2px" borderColor="gray.200">
                      <Table.ColumnHeader 
                        py={4} 
                        px={6} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="gray.700" 
                        textAlign="left"
                        borderRight="1px solid"
                        borderColor="gray.200"
                      >
                        Area
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={4} 
                        px={6} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="gray.700" 
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.200"
                      >
                        Store Count
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={4} 
                        px={6} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="gray.700" 
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.200"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        Meet ToF Target
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={4} 
                        px={6} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="gray.700" 
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.200"
                      >
                        % Meet ToF
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={4} 
                        px={6} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="gray.700" 
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.200"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        Meet OSAT Target
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={4} 
                        px={6} 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="gray.700" 
                        textAlign="center"
                        display={{ base: "none", md: "table-cell" }}
                      >
                        % Meet OSAT
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {(() => {
                      // Calculate summary data for each area
                      const summaryData = Object.entries(STORE_AREAS).map(([areaName, storeNumbers]) => {
                        const areaData = data.filter(row => 
                          storeNumbers.includes(String(row.storeNumber).replace(/^0+/, ''))
                        );
                        
                        if (areaData.length === 0) return null;
                        
                        const meetToF = areaData.filter(row => row.tofDifference >= 0).length;
                        const meetOSAT = areaData.filter(row => row.osatDifference >= 0).length;
                        const totalStores = areaData.length;
                        
                        const tofPercent = totalStores > 0 ? (meetToF / totalStores) * 100 : 0;
                        const osatPercent = totalStores > 0 ? (meetOSAT / totalStores) * 100 : 0;
                        const averagePerformance = (tofPercent + osatPercent) / 2;
                        
                        return {
                          areaName,
                          storeCount: totalStores,
                          meetToF,
                          meetToFPercent: tofPercent.toFixed(1),
                          meetOSAT,
                          meetOSATPercent: osatPercent.toFixed(1),
                          averagePerformance
                        };
                      }).filter(Boolean);
                      
                      // Sort by average performance (highest to lowest)
                      summaryData.sort((a, b) => b.averagePerformance - a.averagePerformance);
                      
                      // Calculate totals
                      const totalStores = data.length;
                      const totalMeetToF = data.filter(row => row.tofDifference >= 0).length;
                      const totalMeetOSAT = data.filter(row => row.osatDifference >= 0).length;
                      
                      const totalRow = {
                        areaName: "Total",
                        storeCount: totalStores,
                        meetToF: totalMeetToF,
                        meetToFPercent: totalStores > 0 ? ((totalMeetToF / totalStores) * 100).toFixed(1) : "0.0",
                        meetOSAT: totalMeetOSAT,
                        meetOSATPercent: totalStores > 0 ? ((totalMeetOSAT / totalStores) * 100).toFixed(1) : "0.0"
                      };
                      
                      return [...summaryData, totalRow].map((row, index) => (
                        <Table.Row 
                          key={row.areaName}
                          bg={row.areaName === "Total" ? "gray.100" : "white"}
                          borderBottom="1px"
                          borderColor="gray.200"
                        >
                          <Table.Cell 
                            py={4} 
                            px={6} 
                            fontWeight="semibold"
                            textAlign="left"
                            borderRight="1px solid"
                            borderColor="gray.200"
                            color={row.areaName === "Total" ? "gray.800" : "gray.700"}
                          >
                            {row.areaName}
                          </Table.Cell>
                          <Table.Cell 
                            py={4} 
                            px={6} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.200"
                            fontWeight="medium"
                          >
                            {row.storeCount}
                          </Table.Cell>
                          <Table.Cell 
                            py={4} 
                            px={6} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.200"
                            fontWeight="medium"
                            display={{ base: "none", md: "table-cell" }}
                          >
                            {row.meetToF}
                          </Table.Cell>
                          <Table.Cell 
                            py={4} 
                            px={6} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.200"
                            fontWeight="bold"
                            color={parseFloat(row.meetToFPercent) >= 75 ? "green.600" : "red.600"}
                          >
                            {row.meetToFPercent}%
                          </Table.Cell>
                          <Table.Cell 
                            py={4} 
                            px={6} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.200"
                            fontWeight="medium"
                            display={{ base: "none", md: "table-cell" }}
                          >
                            {row.meetOSAT}
                          </Table.Cell>
                          <Table.Cell 
                            py={4} 
                            px={6} 
                            textAlign="center"
                            fontWeight="bold"
                            color={parseFloat(row.meetOSATPercent) >= 75 ? "green.600" : "red.600"}
                          >
                            {row.meetOSATPercent}%
                          </Table.Cell>
                        </Table.Row>
                      ));
                    })()}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
            
            {/* Group data by area */}
            {Object.entries(STORE_AREAS).map(([areaName, storeNumbers]) => {
              const areaData = data.filter(row => 
                storeNumbers.includes(String(row.storeNumber).replace(/^0+/, ''))
              );
              
              if (areaData.length === 0) return null;
              
              // Sort by performance: green first, orange second, red last
              const sortedAreaData = [...areaData].sort((a, b) => 
                getPerformancePriority(a) - getPerformancePriority(b)
              );
              
              // Calculate area statistics
              const meetToF = areaData.filter(row => row.tofDifference >= 0).length;
              const meetOSAT = areaData.filter(row => row.osatDifference >= 0).length;
              const meetBoth = areaData.filter(row => row.tofDifference >= 0 && row.osatDifference >= 0).length;
              const meetNeither = areaData.filter(row => row.tofDifference < 0 && row.osatDifference < 0).length;
              const meetOne = areaData.length - meetBoth - meetNeither;
              
              return (
                <Box key={areaName} mb={8}>
                  {(() => {
                    // Calculate area statistics
                    const meetToF = areaData.filter(row => row.tofDifference >= 0).length;
                    const meetOSAT = areaData.filter(row => row.osatDifference >= 0).length;
                    const meetBoth = areaData.filter(row => row.tofDifference >= 0 && row.osatDifference >= 0).length;
                    const meetNeither = areaData.filter(row => row.tofDifference < 0 && row.osatDifference < 0).length;
                    const meetOne = areaData.length - meetBoth - meetNeither;
                    
                    const tofPercent = areaData.length > 0 ? ((meetToF / areaData.length) * 100).toFixed(1) : "0.0";
                    const osatPercent = areaData.length > 0 ? ((meetOSAT / areaData.length) * 100).toFixed(1) : "0.0";
                    
                    return (
                      <VStack align="stretch" spacing={4} mb={6}>
                        {/* Combined Title and Performance Stats Card */}
                        <Box 
                          bg="white"
                          p={4}
                          rounded="xl"
                          shadow="md"
                          borderWidth="1px"
                          borderColor="blue.200"
                          position="relative"
                          overflow="hidden"
                        >
                          {/* Background accent */}
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            h="4px"
                            bgGradient="linear(to-r, blue.400, purple.500)"
                          />
                          
                          {/* Title Section */}
                          <HStack spacing={3} align="center" mb={4}>
                            <Box
                              w="12px"
                              h="12px"
                              rounded="full"
                              bgGradient="linear(to-r, blue.500, purple.600)"
                              flexShrink={0}
                            />
                            <VStack align="start" spacing={1} flex={1}>
                              <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="800"
                                color="gray.800"
                                letterSpacing="tight"
                              >
                                {areaName}
                              </Text>
                              <Text
                                fontSize="sm"
                                color="gray.500"
                                fontWeight="500"
                              >
                                {areaData.length} {areaData.length === 1 ? 'store' : 'stores'}
                              </Text>
                            </VStack>
                            
                            {/* Performance indicator badge */}
                            <Box
                              bg={meetBoth > areaData.length / 2 ? "green.100" : meetNeither > areaData.length / 2 ? "red.100" : "orange.100"}
                              color={meetBoth > areaData.length / 2 ? "green.700" : meetNeither > areaData.length / 2 ? "red.700" : "orange.700"}
                              px={3}
                              py={1}
                              rounded="full"
                              fontSize="xs"
                              fontWeight="bold"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {meetBoth > areaData.length / 2 ? "High" : meetNeither > areaData.length / 2 ? "Low" : "Medium"}
                            </Box>
                          </HStack>
                          
                          {/* Performance Stats */}
                          <Box 
                            bg="gray.50" 
                            p={4} 
                            rounded="lg" 
                            borderWidth="1px" 
                            borderColor="gray.200"
                          >
                            <HStack 
                              flexWrap="wrap" 
                              justify="space-between"
                              align="flex-start"
                              direction={{ base: "column", md: "row" }}
                              spacing={{ base: 4, md: 6 }}
                            >
                              {/* Overall Performance - Donut Chart */}
                              <VStack align="center" spacing={3} minW={{ base: "140px", md: "160px" }}>
                                <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                                  Overall Performance
                                </Text>
                                
                                {/* Donut Chart */}
                                <Box position="relative" w="80px" h="80px">
                                  <svg width="80" height="80" viewBox="0 0 80 80">
                                    {/* Calculate angles for each segment */}
                                    {(() => {
                                      const totalStores = areaData.length;
                                      const greenAngle = (meetBoth / totalStores) * 360;
                                      const orangeAngle = (meetOne / totalStores) * 360;
                                      const redAngle = (meetNeither / totalStores) * 360;
                                      
                                      // SVG circle calculations
                                      const radius = 32;
                                      const centerX = 40;
                                      const centerY = 40;
                                      
                                      // Helper function to create arc path
                                      const createArc = (startAngle, endAngle) => {
                                        const startRad = (startAngle - 90) * Math.PI / 180;
                                        const endRad = (endAngle - 90) * Math.PI / 180;
                                        
                                        const x1 = centerX + radius * Math.cos(startRad);
                                        const y1 = centerY + radius * Math.sin(startRad);
                                        const x2 = centerX + radius * Math.cos(endRad);
                                        const y2 = centerY + radius * Math.sin(endRad);
                                        
                                        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                                        
                                        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${centerX} ${centerY} Z`;
                                      };
                                      
                                      let currentAngle = 0;
                                      
                                      return (
                                        <>
                                          {/* Green segment - Both targets met */}
                                          {meetBoth > 0 && (
                                            <path
                                              d={createArc(currentAngle, currentAngle + greenAngle)}
                                              fill="rgb(74, 222, 128)"
                                              stroke="none"
                                            />
                                          )}
                                          
                                          {/* Orange segment - One target met */}
                                          {meetOne > 0 && (
                                            <path
                                              d={createArc(currentAngle + greenAngle, currentAngle + greenAngle + orangeAngle)}
                                              fill="rgb(251, 146, 60)"
                                              stroke="none"
                                            />
                                          )}
                                          
                                          {/* Red segment - Neither target met */}
                                          {meetNeither > 0 && (
                                            <path
                                              d={createArc(currentAngle + greenAngle + orangeAngle, currentAngle + greenAngle + orangeAngle + redAngle)}
                                              fill="rgb(248, 113, 113)"
                                              stroke="none"
                                            />
                                          )}
                                        </>
                                      );
                                    })()}
                                    
                                    {/* Center circle for donut effect */}
                                    <circle
                                      cx="40"
                                      cy="40"
                                      r="24"
                                      fill="white"
                                      stroke="rgb(229, 231, 235)"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                  
                                  {/* Center text */}
                                  <Box
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    textAlign="center"
                                  >
                                    <Text fontSize="xs" fontWeight="bold" color="gray.700">
                                      {areaData.length}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      total
                                    </Text>
                                  </Box>
                                </Box>
                                
                                {/* Legend */}
                                <VStack spacing={1} align="start">
                                  <HStack spacing={2}>
                                    <Box w="3" h="3" bg="green.400" rounded="full" />
                                    <Text fontSize="xs" color="gray.600">
                                      {meetBoth} Both ({((meetBoth / areaData.length) * 100).toFixed(0)}%)
                                    </Text>
                                  </HStack>
                                  <HStack spacing={2}>
                                    <Box w="3" h="3" bg="orange.400" rounded="full" />
                                    <Text fontSize="xs" color="gray.600">
                                      {meetOne} One ({((meetOne / areaData.length) * 100).toFixed(0)}%)
                                    </Text>
                                  </HStack>
                                  <HStack spacing={2}>
                                    <Box w="3" h="3" bg="red.400" rounded="full" />
                                    <Text fontSize="xs" color="gray.600">
                                      {meetNeither} None ({((meetNeither / areaData.length) * 100).toFixed(0)}%)
                                    </Text>
                                  </HStack>
                                </VStack>
                              </VStack>
                              
                              {/* ToF Performance */}
                              <VStack align="center" spacing={2} minW={{ base: "90px", md: "110px" }}>
                                <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                                  ToF Target
                                </Text>
                                <Text fontSize="xl" fontWeight="bold" color={meetToF > areaData.length / 2 ? "green.600" : "red.600"}>
                                  {tofPercent}%
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {meetToF}/{areaData.length} stores
                                </Text>
                              </VStack>
                              
                              {/* OSAT Performance */}
                              <VStack align="center" spacing={2} minW={{ base: "90px", md: "110px" }}>
                                <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                                  OSAT Target
                                </Text>
                                <Text fontSize="xl" fontWeight="bold" color={meetOSAT > areaData.length / 2 ? "green.600" : "red.600"}>
                                  {osatPercent}%
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {meetOSAT}/{areaData.length} stores
                                </Text>
                              </VStack>
                              
                              {/* Average Performance */}
                              <VStack align="center" spacing={2} minW={{ base: "90px", md: "110px" }}>
                                <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                                  Average
                                </Text>
                                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                                  {(((parseFloat(tofPercent) + parseFloat(osatPercent)) / 2)).toFixed(1)}%
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  Combined
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>
                        </Box>
                      </VStack>
                    );
                  })()}
                    
                    {/* Table Container */}
                    <Box 
                    overflow="auto" 
                    borderWidth="1px" 
                    borderColor="gray.200"
                    rounded="lg"
                    shadow="sm"
                    bg="white"
                    sx={{
                      '&::-webkit-scrollbar': {
                        height: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'gray.100',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'gray.400',
                        borderRadius: '4px',
                      },
                    }}
                  >
                    <Table.Root size={{ base: "xs", md: "sm" }} variant="simple">
                      <Table.Header>
                        <Table.Row bg="gray.50" borderBottom="2px" borderColor="gray.200">
                          {smartHeaders.slice(1).map((header, index) => ( // Remove "Area" column
                              <Table.ColumnHeader 
                                key={index}
                                py={{ base: 2, md: 3 }}
                                px={{ base: 2, md: 4 }}
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight="semibold"
                                color="gray.700"
                                textAlign="center"
                                borderRight={index < smartHeaders.length - 2 ? "1px solid" : "none"}
                                borderColor="gray.200"
                                minW={{ 
                                  base: index === 0 ? "80px" : 
                                        index === 1 ? "120px" : 
                                        index === 2 ? "70px" : 
                                        index === 3 ? "80px" : 
                                        index === 4 ? "80px" : 
                                        index === 5 ? "80px" : 
                                        index === 6 ? "80px" : 
                                        index === 7 ? "80px" : 
                                        index === 8 ? "80px" : 
                                        index === 9 ? "80px" : "80px",
                                  md: "auto"
                                }}
                                display={index === 1 ? { base: "none", md: "table-cell" } : 
                                         index === 5 ? { base: "none", md: "table-cell" } : 
                                         index === 9 ? { base: "none", md: "table-cell" } : 
                                         "table-cell"}
                              >
                                {header}
                              </Table.ColumnHeader>
                            ))}
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {sortedAreaData.map((row, rowIndex) => (
                            <Table.Row 
                              key={rowIndex}
                              _hover={{ bg: "gray.50" }}
                              borderBottom="1px"
                              borderColor="gray.100"
                            >
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                fontWeight="medium"
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                                bg={(() => {
                                  // Check if store meets both targets
                                  const meetsToF = row.tofDifference >= 0;
                                  const meetsOSAT = row.osatDifference >= 0;
                                  
                                  if (meetsToF && meetsOSAT) {
                                    return "green.50"; // Both targets met - green
                                  } else if (!meetsToF && !meetsOSAT) {
                                    return "red.50"; // Neither target met - red
                                  } else {
                                    return "orange.50"; // At least one target met - orange
                                  }
                                })()}
                              >
                                {row.storeNumber}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                fontWeight="medium"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                                display={{ base: "none", md: "table-cell" }}
                              >
                                {row.storeName}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {row.count}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {row.ptdTasteOfFood?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {row.tofTarget?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                                display={{ base: "none", md: "table-cell" }}
                              >
                                {row.tofDifference?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {row.tofSurveysNeeded ? row.tofSurveysNeeded : `+${Math.abs(row.tofDifference).toFixed(1)}%`}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {row.ptdOsat?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                {row.osatTarget?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 3 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                                display={{ base: "none", md: "table-cell" }}
                              >
                                {row.osatDifference?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={{ base: 2, md: 3 }} 
                                px={{ base: 2, md: 4 }} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                fontSize={{ base: "xs", md: "sm" }}
                                bg={row.osatSurveysNeeded ? "red.50" : ""}
                              >
                                {row.osatSurveysNeeded ? row.osatSurveysNeeded : `+${Math.abs(row.osatDifference).toFixed(1)}%`}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  </Box>
                );
            })}
            
            {/* Area tables completed */}
          </VStack>
        )}

        {data.length === 0 && (
          <Text fontSize="sm" color="gray.500">Upload a file to generate the smart report.</Text>
        )}
      </VStack>
    </Box>
  );
}