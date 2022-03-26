import React from "react";
import {
  Avatar,
  VStack,
  HStack,
  Box,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { useStxAddresses, useAuth } from "@micro-stacks/react";
import ThemeToggle from "./themeToggle";
import Link from "next/link";
import Container from "./container";
import { fPrincipal } from "../utils";

const Header = () => {
  const { handleSignOut } = useAuth();
  const stxAddress = useStxAddresses();
  return (
    <Box
      bg={useColorModeValue("white", "neutralD.100")}
      display={"block"}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="2px"
      borderBottomColor={useColorModeValue("neutral.400", "neutralD.400")}
      shadow="0 0 10px 0 rgba(0,0,0, 0.035);"
    >
      <Container>
        <VStack align="start" spacing={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <Link href="/">
              <Avatar
                name="CityCoins"
                size="sm"
                src="https://cdn.citycoins.co/logos/citycoin.png"
                cursor="pointer"
                bg={useColorModeValue("white", "neutralD.100")}
              />
            </Link>
            <HStack spacing={2}>
              {stxAddress?.mainnet && (
                <Button
                  variant="unstyled"
                  fontSize="sm"
                  onClick={() => handleSignOut()}
                >
                  {fPrincipal(stxAddress.mainnet)}
                </Button>
              )}
            </HStack>
            <HStack>
              <ThemeToggle />
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};
export default Header;
