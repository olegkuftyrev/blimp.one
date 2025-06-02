// Никаких странных алиасов – обычный импорт
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: { 500: "#2B6CB0" },
  },
});

export default theme;
