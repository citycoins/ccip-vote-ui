import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
  Link,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth, useTransactionPopup } from "@micro-stacks/react";
import Section from "../src/components/section";
import PageTransition from "../src/components/pageTransition";
import VoteCard from "../src/components/voteCard";

export default function Home() {
  const { handleContractCall } = useTransactionPopup();
  const { isSignedIn, handleSignIn } = useAuth();
  const [inFavor, setInfavor] = useState(0);
  const [against, setAgainst] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(async () => {
    try {
      // fetch voting data from contract
    } catch (e) {
      // handle error fetching voting data
    }
  }, []);

  const ccip = {
    title: "CCIP-011",
    description:
      "The Stacks blockchain is a Layer 1 blockchain connected to Bitcoin, in which miners spend Bitcoin to bid for and win a fixed amount of Stacks tokens. Stackers have the option to lock up Stacks tokens for a specified amount of time, and in turn, receive a portion of the Bitcoin spent by miners proportionate to the amount Stacked.",
    url: "https://github.com/citycoins/governance/blob/feat/community-upgrade-1/ccips/ccip-011/ccip-011-citycoins-stacked-tokens-voting.md",
    contractAddress: "",
    contractName: "",
  };

  const handleVote = async (fn) => {
    try {
      await handleContractCall({
        contractAddress: ccip.contractAddress,
        contractName: ccip.contractName,
        functionName: fn,
        functionArgs: [],
      });
    } catch (e) {
      // handle vote error
    }
  };

  return (
    <PageTransition>
      <Box>
        <VStack spacing={20}>
          <Heading size="xl">Vote on {ccip.title}</Heading>
          <Section>
            {/* Votes For */}
            <Flex width="100%">
              <Flex width={{ base: "80%", md: "66%" }}>
                <VoteCard
                  title="In Support"
                  subtitle="100000 stx"
                  description="28 votes"
                  src="https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif"
                />
              </Flex>
            </Flex>
            {/* Votes Against */}
            <Flex width="100%" justifyContent="flex-end">
              <Flex width={{ base: "80%", md: "66%" }}>
                <VoteCard
                  title="Against"
                  src="https://media.giphy.com/media/gtG7xKn2vqzufFynnl/giphy.gif"
                  subtitle="0 stx"
                  description="0 votes"
                  against
                />
              </Flex>
            </Flex>
          </Section>
          {/* CCIP Description */}
          <Section>
            <VStack spacing={10} align="start" fontSize="1xl">
              <Heading size="lg">Description</Heading>
              <VStack>
                <Text>{ccip.description}</Text>
              </VStack>
              <Link href={ccip.url} target="_blank">
                Read it for yourself
                <ArrowForwardIcon marginLeft={8} />
              </Link>
            </VStack>
          </Section>
          {/* CCIP Voting */}
          {!isSignedIn && (
            <Section>
              <Button
                isFullWidth
                variant="solid"
                colorScheme="green"
                onClick={() => handleSignIn()}
              >
                Login To Vote
              </Button>
            </Section>
          )}
          {!hasVoted && isSignedIn && (
            <Section>
              <VStack align="start" spacing={10}>
                <Heading size="lg">Cast Your Vote</Heading>
                <SimpleGrid columns={[1, 1, 2]} spacing={8} mt={8} w="100%">
                  <Button
                    isFullWidth
                    variant="outline"
                    colorScheme="red"
                    onClick={() => handleVote("no")}
                  >
                    No
                    <CloseIcon marginLeft={5} fontSize={10} />
                  </Button>
                  <Button
                    isFullWidth
                    variant="outline"
                    colorScheme="green"
                    onClick={() => handleVote("yes")}
                  >
                    Yes
                    <CheckIcon marginLeft={5} fontSize={10} />
                  </Button>
                </SimpleGrid>
              </VStack>
            </Section>
          )}
        </VStack>
      </Box>
    </PageTransition>
  );
}
