import React from "react";
import {
  VStack,
  useColorModeValue,
  Text,
  Stack,
  Image,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import numeral from "numeral";

export const VoteCard = ({
  title = "",
  subtitle = "",
  description = "",
  src = "",
  against,
  voteTotals = [],
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
            {title}{" "}
            {voteTotals && (
              <Popover trigger="hover" placement={against ? "left" : "right"}>
                <PopoverTrigger>
                  <InfoIcon />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>{title} Voting Stats</PopoverHeader>
                  <PopoverBody>
                    {voteTotals?.map((city) => {
                      return (
                        <Text key={city.label} fontSize="sm">{`${
                          city.label
                        }: ${numeral(city.value).format("0,0")}`}</Text>
                      );
                    })}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
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
