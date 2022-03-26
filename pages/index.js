import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth, useTransactionPopup } from "@micro-stacks/react";
import Section from "../src/components/section";
import Link from "../src/components/link";
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
    title: "CCIP-01",
    description:
      "The current Clarity cost limits were set very conservatively in Stacks 2.0: blocks with contract-calls frequently meet one or more of these limits, which negatively affects transaction throughput. This SIP proposes an update to these cost-limits via a network upgrade and further, that the network upgrade be executed at a block height chosen by an off-chain process described in this SIP.",
    url: "https://github.com/hirosystems/sips/blob/draft/sip-012/sips/sip-012/sip-012-cost-limits-network-upgrade.md",
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
              <Link href={ccip.url}>
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
