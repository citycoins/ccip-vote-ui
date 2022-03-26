import React from "react";
import {
  HStack,
  Button,
  useColorMode,
  Text,
  useColorModeValue,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import Container from "../components/container";
import NextLink from "next/link";
// import Link from "./link";

const Footer = () => {
  const date = new Date().getFullYear();

  function FooterLink(props) {
    const { href, name, ...rest } = props;

    return (
      <NextLink href={href} passHref>
        <Button
          variant="unstyled"
          {...rest}
          color={useColorModeValue("neutral.800", "neutralD.800")}
          _hover={{ color: useColorModeValue("neutral.1000", "neutralD.1000") }}
        >
          {name}
        </Button>
      </NextLink>
    );
  }

  return (
    <Container>
      <HStack
        justify="center"
        w="100%"
        display={{ base: "none", md: "flex" }}
        my={8}
        spacing={4}
      >
        <FooterLink href="https://twitter.com/mineCityCoins" name="Twitter" />
        <FooterLink href="https://chat.citycoins.co" name="Discord" />
        <FooterLink href="https://docs.citycoins.co/" name="Docs" />
      </HStack>
    </Container>
  );
};
export default Footer;
