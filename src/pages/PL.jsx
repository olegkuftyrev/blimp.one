
// src/pages/PL.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Table,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  VStack,
  HStack
} from "@chakra-ui/react";
import useExcelRows from "../hooks/useExcelRows.js";
import { useAppStore } from "../store/useAppStore.js";
import PLUploadBar from "../components/PLUploadBar.jsx";


import Overview from "../components/pld/Overview.jsx";

import COGS from "../components/pld/COGS.jsx";
import COGSchart from "../components/pld/COGSchart.jsx";

import Controllables from "../components/pld/Controllables.jsx";
import ControllablesChart from "../components/pld/ControllablesChart.jsx";


/* ---------- mini table to preview first rows ---------- */
function DebugTable({ rows, maxRows = 15 }) {
  if (!rows || rows.length === 0) return null;

  const header = rows[0];
  const sample = rows.slice(1, maxRows);
   
    const itemProps = [
    { circle: "14", height: "220px", lines: 3 },
    { circle: "10", height: "180px", lines: 2 },
    { circle: "16", height: "260px", lines: 4 },
    { circle: "12", height: "200px", lines: 1 },
    { circle: "10", height: "190px", lines: 3 },
    { circle: "14", height: "240px", lines: 2 },
    { circle: "12", height: "210px", lines: 2 },
    { circle: "16", height: "250px", lines: 4 },
    ];
 


  return (
    <Table.Root size="sm" variant="simple" overflowX="auto">
      <Table.Header>
        <Table.Row>
          {header.map((h, idx) => (
            <Table.ColumnHeader key={idx}>{h || "-"}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sample.map((r, rIdx) => (
          <Table.Row key={rIdx}>
            {header.map((_, cIdx) => (
              <Table.Cell key={cIdx}>
                {r[cIdx] !== undefined && r[cIdx] !== ""
                  ? r[cIdx].toString()
                  : "-"}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default function PL() {
  const { rows, load } = useExcelRows();
  const [loading, setLoading] = useState(false);
  const setPlData = useAppStore((s) => s.setPlData);

  /* ---------- upload Excel ---------- */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    await load(file);
    setLoading(false);
  };

  /* ---------- create values object ---------- */
  const values = {};
  rows.forEach((r) => {
    if (typeof r[0] === "string") values[r[0]] = r[1];
  });

  /* ---------- save to zustand whenever rows change ---------- */
  useEffect(() => {
    if (rows.length) setPlData(rows, values);
  }, [rows]);

  return (
    <Box p={4}  mx="auto">
      <Text fontSize="2xl" textAlign="center" mb={4}>
        P&amp;L Dashboard
      </Text>


     <PLUploadBar rows={rows} handleFileUpload={handleFileUpload} onFile={handleFileUpload} />

      {/* Upload control 
      <Box as="fieldset" mb={6} border="none">
        <Text as="legend" fontSize="md" mb={2}>
          Upload Excel&nbsp;file (.xlsx, .xls)
        </Text>
        <Input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      </Box>*/}

      {loading && <Text mb={4}>Loading…</Text>}

      {/* Cards */}
      {rows.length > 0 ? (
        <>
          <Box mb={6}>
            <Overview values={values} />
          </Box>
           <Box mb={6}>
            <COGSchart rows={rows} />
          </Box>
           <Box mb={6}>
            <COGS rows={rows} />
          </Box>
          <Box mb={6}>
            <Controllables rows={rows} />
          </Box>
          <Box mb={6}>
            <ControllablesChart rows={rows} />
          </Box>
        </>
      ): (
        
<VStack w="full" h="100vh" spacing={6}>
  <HStack w="full" spacing={6}>
      <VStack  w="full" h="full">
        <HStack w="full">
          <SkeletonCircle size="10" />
          <SkeletonText noOfLines={2} w="full" />
        </HStack>
        <Skeleton h="200px" w="full" />
      </VStack>
      <VStack  w="full" h="full">
        <HStack w="full">
          <SkeletonCircle size="10" />
          <SkeletonText noOfLines={2} w="full" />
        </HStack>
        <Skeleton h="200px" w="full" />
      </VStack>
  </HStack>
  <HStack w="full" spacing={6}>
    {[...Array(4)].map((_, i) => (
      <VStack key={i} w="full" h="full">
        <HStack w="full">
          <SkeletonCircle size="10" />
          <SkeletonText noOfLines={2} w="full" />
        </HStack>
        <Skeleton h="200px" w="full" />
      </VStack>
    ))}
  </HStack>
</VStack>





      )}
    </Box>
  );
}
