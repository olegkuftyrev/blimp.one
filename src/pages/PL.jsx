// src/pages/PL.jsx
import React, { useState } from "react";
import { Box, Input, Text, Flex } from "@chakra-ui/react";
import useExcelRows from "../hooks/useExcelRows.js";
import Overview from "../components/pld/Overview.jsx";
import COGS from "../components/pld/COGS.jsx";

export default function PL() {
  const { rows, load } = useExcelRows();
  const [loading, setLoading] = useState(false);

  // Загрузка Excel-файла
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    await load(file);
    setLoading(false);
  };

  // Преобразуем rows в объект values: ключ — первая колонка, значение — вторая
  const values = {};
  if (rows.length > 0) {
    rows.forEach((row) => {
      if (row[0] && typeof row[0] === "string") {
        values[row[0]] = row[1];
      }
    });
  }

  return (
    <Box p={4} width="100%">
      <Text fontSize="2xl" mb={4} textAlign="center">
        P&amp;L Dashboard
      </Text>

      {/* Загрузка Excel */}
      <Box as="fieldset" mb={6} border="none">
        <Text as="legend" fontSize="md" mb={2}>
          Загрузите Excel-файл (.xlsx, .xls)
        </Text>
        <Input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      </Box>

      {loading && <Text mb={4}>Загрузка...</Text>}

      {/* Если данные есть, рендерим компоненты друг под другом, 100% ширины */}
      {rows.length > 0 && (
        <Flex direction="column" gap={4} width="100%">
          <Box width="100%">
            <Overview values={values} />
          </Box>
          <Box width="100%">
            <COGS rows={rows} />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
