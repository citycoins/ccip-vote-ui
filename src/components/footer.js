import React from "react";
import { HStack, Button, useColorModeValue, Link } from "@chakra-ui/react";
import Container from "../components/container";

const Footer = () => {
  function FooterLink(props) {
    const { href, name, ...rest } = props;

    return (
      <Link href={href} target="_blank">
        <Button
          variant="unstyled"
          {...rest}
          color={useColorModeValue("neutral.800", "neutralD.800")}
          _hover={{ color: useColorModeValue("neutral.1000", "neutralD.1000") }}
        >
          {name}
        </Button>
      </Link>
    );
  }

  return (
    <Container>
      <HStack justify="center" w="100%" my={8} spacing={4}>
        <FooterLink href="https://twitter.com/mineCityCoins" name="Twitter" />
        <FooterLink href="https://chat.citycoins.co" name="Discord" />
        <FooterLink href="https://github.com/citycoins" name="Github" />
        <FooterLink href="https://docs.citycoins.co/" name="Docs" />
      </HStack>
    </Container>
  );
};
export default Footer;
