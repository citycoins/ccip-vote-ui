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
  useToast,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import {
  useAuth,
  useTransactionPopup,
  useCurrentStxAddress,
} from "@micro-stacks/react";
// import { useStxAddresses, useAuth, useCurrentStxAddress } from "@micro-stacks/react";
import { boolCV, principalCV } from "micro-stacks/clarity";
import Section from "../src/components/section";
import PageTransition from "../src/components/pageTransition";
import VoteCard from "../src/components/voteCard";
import { callContract, STACKS_NETWORK } from "../src/services";
import { fPrincipal } from "../src/utils";

const createYes = (voteTotals) => {
  return [
    {
      label: "MIA",
      value: voteTotals.yesMia,
    },
    {
      label: "NYC",
      value: voteTotals.yesNyc,
    },
  ];
};

const createNo = (voteTotals) => {
  return [
    {
      label: "MIA",
      value: voteTotals.noMia,
    },
    {
      label: "NYC",
      value: voteTotals.noNyc,
    },
  ];
};

export default function Home() {
  const toast = useToast();
  const { handleContractCall } = useTransactionPopup();
  const { isSignedIn, handleSignIn } = useAuth();
  const [voteTotals, setVoteTotals] = useState();
  const [userVote, setUserVote] = useState(false);
  const address = useCurrentStxAddress();

  const ccip = {
    title: "CCIP-011",
    description:
      "The Stacks blockchain is a Layer 1 blockchain connected to Bitcoin, in which miners spend Bitcoin to bid for and win a fixed amount of Stacks tokens. Stackers have the option to lock up Stacks tokens for a specified amount of time, and in turn, receive a portion of the Bitcoin spent by miners proportionate to the amount Stacked.",
    url: "https://github.com/citycoins/governance/blob/feat/community-upgrade-1/ccips/ccip-011/ccip-011-citycoins-stacked-tokens-voting.md",
    contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
    contractName: "citycoin-vote-v1",
  };

  useEffect(async () => {
    try {
      // fetch voting data from contract
      const [totals, walletVote] = await Promise.all([
        callContract({
          contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
          contractName: "citycoin-vote-v1",
          functionName: "get-proposal-votes",
        }),
        callContract(
          {
            contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
            contractName: "citycoin-vote-v1",
            functionName: "get-voter-info",
          },
          [principalCV(address)]
        ),
      ]);

      setVoteTotals(totals);
      setUserVote(walletVote === "8000" ? false : walletVote);
    } catch (e) {
      // handle error fetching voting data
    }
  }, [address]);

  const handleVote = async (vote) => {
    await handleContractCall({
      contractAddress: ccip.contractAddress,
      contractName: ccip.contractName,
      functionName: "vote-on-proposal",
      functionArgs: [boolCV(vote)],
      network: STACKS_NETWORK,
      onCancel: () => {
        console.log("cancelled");
      },
      onFinish: (res) => {
        toast({
          title: "Vote broadcast!",
          description: (
            <Link
              href={`https://explorer.stacks.co/txid/${res.txId}?chain=mainnet`}
              target="_blank"
            >{`View on explorer ${fPrincipal(res.txId)}`}</Link>
          ),
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    });
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
                  subtitle={`${voteTotals?.yesTotal}cc`}
                  description={`${voteTotals?.yesCount} votes`}
                  src="https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif"
                  voteTotals={voteTotals && createYes(voteTotals)}
                />
              </Flex>
            </Flex>
            {/* Votes Against */}
            <Flex width="100%" justifyContent="flex-end">
              <Flex width={{ base: "80%", md: "66%" }}>
                <VoteCard
                  title="Against"
                  src="https://media.giphy.com/media/gtG7xKn2vqzufFynnl/giphy.gif"
                  subtitle={`${voteTotals?.noTotal}cc`}
                  description={`${voteTotals?.noCount} votes`}
                  against
                  voteTotals={voteTotals && createNo(voteTotals)}
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
          {!userVote && isSignedIn && (
            <Section>
              <VStack align="start" spacing={10}>
                <Heading size="lg">Cast Your Vote</Heading>
                <SimpleGrid columns={[1, 1, 2]} spacing={8} mt={8} w="100%">
                  <Button
                    isFullWidth
                    variant="outline"
                    colorScheme="red"
                    onClick={() => handleVote(false)}
                  >
                    No
                    <CloseIcon marginLeft={5} fontSize={10} />
                  </Button>
                  <Button
                    isFullWidth
                    variant="outline"
                    colorScheme="green"
                    onClick={() => handleVote(true)}
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
