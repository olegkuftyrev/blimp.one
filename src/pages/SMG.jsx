// src/pages/SMG.jsx
import React, { useState } from "react";
import { Box, Text, Input, Table, VStack } from "@chakra-ui/react";
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
  "Simon": ["1650", "1649", "566", "708", "884", "1016", "1024", "1074", "1219", "1232", "1564", "1709", "1725", "1881", "2605", "3829"]
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
    <Box p={4} mx="auto">
      <VStack align="stretch" spacing={4}>
        <Box as="fieldset" border="none">
          <Text as="legend" fontSize="md" mb={2}>
            Upload Excel file (.xlsx) to generate smart report
          </Text>
          <Input
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileUpload}
          />
          {err && <Text color="red.500" fontSize="sm" mt={2}>{err}</Text>}
        </Box>

        {data.length > 0 && (
          <VStack spacing={6} align="stretch">
            {/* Summary Table */}
            <Box>
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color="gray.700" 
                mb={3}
                pl={2}
                borderLeft="4px solid"
                borderColor="gray.500"
              >
                Performance Summary by Area
              </Text>
              <Box 
                overflow="auto" 
                borderWidth="1px" 
                borderColor="gray.200"
                rounded="lg"
                shadow="sm"
                bg="white"
              >
                <Table.Root size="sm" variant="simple">
                  <Table.Header>
                    <Table.Row bg="gray.100" borderBottom="2px" borderColor="gray.300">
                      <Table.ColumnHeader 
                        py={3} 
                        px={4} 
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.300"
                      >
                        Area
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={3} 
                        px={4} 
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.300"
                      >
                        Store Count
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={3} 
                        px={4} 
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.300"
                      >
                        Meet ToF Target
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={3} 
                        px={4} 
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.300"
                      >
                        % Meet ToF
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={3} 
                        px={4} 
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.300"
                      >
                        Meet OSAT Target
                      </Table.ColumnHeader>
                      <Table.ColumnHeader 
                        py={3} 
                        px={4} 
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.800"
                        textAlign="center"
                        borderRight="1px solid"
                        borderColor="gray.300"
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
                        
                        return {
                          areaName,
                          storeCount: totalStores,
                          meetToF,
                          meetToFPercent: totalStores > 0 ? ((meetToF / totalStores) * 100).toFixed(1) : "0.0",
                          meetOSAT,
                          meetOSATPercent: totalStores > 0 ? ((meetOSAT / totalStores) * 100).toFixed(1) : "0.0"
                        };
                      }).filter(Boolean);
                      
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
                          bg={index % 4 === 0 ? "pink.50" : 
                              index % 4 === 1 ? "blue.50" : 
                              index % 4 === 2 ? "purple.50" : 
                              index % 4 === 3 ? "green.50" : 
                              row.areaName === "Total" ? "gray.100" : "white"}
                          borderBottom="1px"
                          borderColor="gray.200"
                        >
                          <Table.Cell 
                            py={3} 
                            px={4} 
                            fontWeight="bold"
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.300"
                          >
                            {row.areaName}
                          </Table.Cell>
                          <Table.Cell 
                            py={3} 
                            px={4} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.300"
                          >
                            {row.storeCount}
                          </Table.Cell>
                          <Table.Cell 
                            py={3} 
                            px={4} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.300"
                          >
                            {row.meetToF}
                          </Table.Cell>
                          <Table.Cell 
                            py={3} 
                            px={4} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.300"
                            fontWeight="bold"
                          >
                            {row.meetToFPercent}%
                          </Table.Cell>
                          <Table.Cell 
                            py={3} 
                            px={4} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.300"
                          >
                            {row.meetOSAT}
                          </Table.Cell>
                          <Table.Cell 
                            py={3} 
                            px={4} 
                            textAlign="center"
                            borderRight="1px solid"
                            borderColor="gray.300"
                            fontWeight="bold"
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
              
              return (
                <Box key={areaName}>
                  <Text 
                    fontSize="xl" 
                    fontWeight="bold" 
                    color="blue.700" 
                    mb={3}
                    pl={2}
                    borderLeft="4px solid"
                    borderColor="blue.500"
                  >
                      {areaName} ({areaData.length} stores)
                    </Text>
                    <Box 
                      overflow="auto" 
                      borderWidth="1px" 
                      borderColor="gray.200"
                      rounded="lg"
                      shadow="sm"
                      bg="white"
                    >
                      <Table.Root size="sm" variant="simple">
                        <Table.Header>
                          <Table.Row bg="gray.50" borderBottom="2px" borderColor="gray.200">
                            {smartHeaders.slice(1).map((header, index) => ( // Remove "Area" column
                              <Table.ColumnHeader 
                                key={index}
                                py={3}
                                px={4}
                                fontSize="sm"
                                fontWeight="semibold"
                                color="gray.700"
                                textAlign="center"
                                borderRight={index < smartHeaders.length - 2 ? "1px solid" : "none"}
                                borderColor="gray.200"
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
                                py={3} 
                                px={4} 
                                fontWeight="medium"
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
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
                                py={3} 
                                px={4} 
                                fontWeight="medium"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.storeName}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.count}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.ptdTasteOfFood?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.tofTarget?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.tofDifference?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                                bg={row.tofSurveysNeeded ? "red.50" : ""}
                              >
                                {row.tofSurveysNeeded ? row.tofSurveysNeeded : `+${Math.abs(row.tofDifference).toFixed(1)}%`}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.ptdOsat?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.osatTarget?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
                              >
                                {row.osatDifference?.toFixed(1) || ""}
                              </Table.Cell>
                              <Table.Cell 
                                py={3} 
                                px={4} 
                                textAlign="center"
                                borderRight="1px solid"
                                borderColor="gray.200"
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
            
            {/* Region table for stores not in defined areas */}
            {(() => {
              const regionData = data.filter(row => {
                const cleanStoreNumber = String(row.storeNumber).replace(/^0+/, '');
                return !Object.values(STORE_AREAS).flat().includes(cleanStoreNumber);
              });
              
              if (regionData.length === 0) return null;
              
              // Sort by performance: green first, orange second, red last
              const sortedRegionData = [...regionData].sort((a, b) => 
                getPerformancePriority(a) - getPerformancePriority(b)
              );
              
              return (
                <Box>
                  <Text 
                    fontSize="xl" 
                    fontWeight="bold" 
                    color="purple.700" 
                    mb={3}
                    pl={2}
                    borderLeft="4px solid"
                    borderColor="purple.500"
                  >
                    Region ({regionData.length} stores)
                  </Text>
                  <Box 
                    overflow="auto" 
                    borderWidth="1px" 
                    borderColor="gray.200"
                    rounded="lg"
                    shadow="sm"
                    bg="white"
                  >
                    <Table.Root size="sm" variant="simple">
                      <Table.Header>
                        <Table.Row bg="gray.50" borderBottom="2px" borderColor="gray.200">
                          {smartHeaders.slice(1).map((header, index) => (
                            <Table.ColumnHeader 
                              key={index}
                              py={3}
                              px={4}
                              fontSize="sm"
                              fontWeight="semibold"
                              color="gray.700"
                              textAlign="center"
                              borderRight={index < smartHeaders.length - 2 ? "1px solid" : "none"}
                              borderColor="gray.200"
                            >
                              {header}
                            </Table.ColumnHeader>
                          ))}
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {sortedRegionData.map((row, rowIndex) => (
                          <Table.Row 
                            key={rowIndex}
                            _hover={{ bg: "gray.50" }}
                            borderBottom="1px"
                            borderColor="gray.100"
                          >
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              fontWeight="medium"
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
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
                              py={3} 
                              px={4} 
                              fontWeight="medium"
                              borderRight="1px solid"
                              borderColor="gray.200"
                            >
                              {row.storeName}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              bg="green.50"
                              borderRight="1px solid"
                              borderColor="gray.200"
                            >
                              {row.count}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                            >
                              {row.ptdTasteOfFood?.toFixed(1) || ""}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                            >
                              {row.tofTarget?.toFixed(1) || ""}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                              {...getDifferenceStyle(row.tofDifference)}
                            >
                              {row.tofDifference?.toFixed(1) || ""}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                              bg={row.tofSurveysNeeded ? "red.50" : ""}
                            >
                              {row.tofSurveysNeeded ? row.tofSurveysNeeded : `+${Math.abs(row.tofDifference).toFixed(1)}%`}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                            >
                              {row.ptdOsat?.toFixed(1) || ""}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                            >
                              {row.osatTarget?.toFixed(1) || ""}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              borderRight="1px solid"
                              borderColor="gray.200"
                              {...getDifferenceStyle(row.osatDifference)}
                            >
                              {row.osatDifference?.toFixed(1) || ""}
                            </Table.Cell>
                            <Table.Cell 
                              py={3} 
                              px={4} 
                              textAlign="center"
                              bg="green.200"
                              fontWeight="medium"
                              borderRight="1px solid"
                              borderColor="gray.200"
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
            })()}
          </VStack>
        )}

        {data.length === 0 && (
          <Text fontSize="sm" color="gray.500">Upload a file to generate the smart report.</Text>
        )}
      </VStack>
    </Box>
  );
}
