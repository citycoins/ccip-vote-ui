import React from "react";
import {
  VStack,
  useColorModeValue,
  Text,
  Stack,
  Image,
  HStack,
} from "@chakra-ui/react";

export const VoteCard = ({
  title = "",
  subtitle = "",
  description = "",
  src = "",
  against,
}) => {
  return (
    <Stack
      w="100%"
      rounded="lg"
      borderWidth="2px"
      bg={useColorModeValue("white", "neutralD.100")}
      borderColor={useColorModeValue("neutral.400", "neutralD.400")}
      p={4}
      spacing={4}
    >
      <HStack flexDirection={against ? "row-reverse" : undefined}>
        <Image
          src={src}
          borderRadius="full"
          boxSize={{ base: "100px", md: "150px" }}
          boxShadow="xs"
          margin="5px 10px"
        />
        <VStack align={against ? "end" : "start"} margin={"100px"}>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
            fontWeight="bold"
          >
            {title}
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            {subtitle}
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
            fontWeight="bold"
          >
            {description}
          </Text>
        </VStack>
      </HStack>
    </Stack>
  );
};

export default VoteCard;
