// src/components/TopNav.jsx
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Flex, Box, Link, Button, Spacer, Icon } from "@chakra-ui/react";
import { GiShipWheel } from "react-icons/gi";

export default function TopNav() {
  const location = useLocation();

  // don’t render on landing page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Flex
      as="nav"
      bg="white"
      px={4}
      py={2}
      boxShadow="sm"
      align="center"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Box display="flex" alignItems="center">
        <Icon size="lg" color="pink.700" mr={2}>
          <GiShipWheel/>
        </Icon>
        <Link as={RouterLink} to="/" fontWeight="bold">
          Home
        </Link>
      </Box>
      <Spacer />
      <Box>
        <Button
          as={RouterLink}
          to="/idp"
          variant={location.pathname.startsWith("/idp") ? "solid" : "ghost"}
          size="sm"
          mr={2}
        >
          IDP
        </Button>
        <Button
          as={RouterLink}
          to="/pl"
          variant={location.pathname === "/pl" ? "solid" : "ghost"}
          size="sm"
          mr={2}
        >
          P&L
        </Button>
        <Button
          as={RouterLink}
          to="/smg"
          variant={location.pathname === "/smg" ? "solid" : "ghost"}
          size="sm"
        >
          SMG
        </Button>
      </Box>
    </Flex>
  );
}
