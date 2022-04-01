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
  Center,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import {
  useAuth,
  useTransactionPopup,
  useCurrentStxAddress,
} from "@micro-stacks/react";
import { boolCV, principalCV } from "micro-stacks/clarity";
import numeral from "numeral";
import Section from "../src/components/section";
import PageTransition from "../src/components/pageTransition";
import VoteCard from "../src/components/voteCard";
import {
  callContract,
  getStacksBlockHeight,
  STACKS_NETWORK,
} from "../src/services";

import { fPrincipal, createNo, createYes, createStatus } from "../src/utils";

const ccip = {
  description:
    "The Stacks blockchain is a Layer 1 blockchain connected to Bitcoin, in which miners spend Bitcoin to bid for and win a fixed amount of Stacks tokens. Stackers have the option to lock up Stacks tokens for a specified amount of time, and in turn, receive a portion of the Bitcoin spent by miners proportionate to the amount Stacked.",
  url: "https://github.com/citycoins/governance/blob/feat/community-upgrade-1/ccips/ccip-011/ccip-011-citycoins-stacked-tokens-voting.md",
  contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
  contractName: "citycoin-vote-v1",
  readForYourself: [
    {
      id: "CCIP-007",
      url: "https://github.com/citycoins/governance/blob/feat/community-upgrade-1/ccips/ccip-007/ccip-007-citycoins-auth.md",
    },
    {
      id: "CCIP-008",
      url: "https://github.com/citycoins/governance/blob/feat/community-upgrade-1/ccips/ccip-008/ccip-008-citycoins-sip-010-token-v2.md",
    },
    {
      id: "CCIP-009",
      url: "https://github.com/citycoins/governance/blob/feat/community-upgrade-1/ccips/ccip-009/ccip-009-citycoins-vrf-v2.md",
    },
  ],
};

const votingStates = ["not_initialized", "not_started_yet", "active", "over"];

export default function Home() {
  const toast = useToast();
  const { handleContractCall } = useTransactionPopup();
  const address = useCurrentStxAddress();
  const { isSignedIn, handleSignIn } = useAuth();
  const [contractStartEnd, setContractStartEnd] = useState({
    startBlock: 0,
    endBlock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [blockHeight, setBlockHeight] = useState(0);
  const [voteTotals, setVoteTotals] = useState();
  const [userVoteStats, setUserVote] = useState(false);
  const [status, setStatus] = useState(votingStates[0]);

  useEffect(() => {
    const loadContractData = async () => {
      try {
        const currBlockHeight = await getStacksBlockHeight();
        setBlockHeight(currBlockHeight);
        if (address) {
          const userVotes = await callContract(
            {
              contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
              contractName: "citycoin-vote-v1",
              functionName: "get-voter-info",
            },
            [principalCV(address)]
          );
          setUserVote(userVotes === "8000" ? false : userVotes);
        }

        // fetch voting data from contract
        const [totals, startEnd] = await Promise.all([
          callContract({
            contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
            contractName: "citycoin-vote-v1",
            functionName: "get-proposal-votes",
          }),
          callContract({
            contractAddress: "ST1HHSDYJ0SGAM6K2W01ZF5K7AJFKWMJNH0SH3NP9",
            contractName: "citycoin-vote-v1",
            functionName: "get-vote-blocks",
          }),
        ]);

        setContractStartEnd(startEnd);
        setStatus(createStatus(startEnd, currBlockHeight));
        setVoteTotals(totals);
      } catch (e) {
        // handle error fetching voting data
        console.info(e);
      } finally {
        setLoading(false);
      }
    };

    loadContractData();
  }, [address]);

  const handleVote = async (vote) => {
    await handleContractCall({
      contractAddress: ccip.contractAddress,
      contractName: ccip.contractName,
      functionName: "vote-on-proposal",
      functionArgs: [boolCV(vote)],
      network: STACKS_NETWORK,
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

  const active = contractStartEnd?.endBlock - blockHeight;
  const not_started_yet = contractStartEnd?.startBlock - blockHeight;
  const over = blockHeight - contractStartEnd?.endBlock;

  return (
    <PageTransition>
      <Box>
        <VStack spacing={10}>
          <VStack textAlign="center">
            <Heading size="xl">Upgrade CityCoins Vote</Heading>
            <Skeleton isLoaded={!loading}>
              {status === "not_initialized" && (
                <Text fontSize="sm">
                  {"Voting contract hasn't been deployed"}
                </Text>
              )}
              {status === "active" && (
                <>
                  <Text fontSize="sm">
                    {`Voting Active! Vote ends in ${active} block${
                      active > 1 ? "s" : ""
                    }`}
                  </Text>
                </>
              )}

              {status === "not_started_yet" && (
                <Text fontSize="sm">
                  {`Vote starts in ${not_started_yet} block${
                    not_started_yet > 1 ? "s" : ""
                  }`}
                </Text>
              )}

              {status === "over" && (
                <Text fontSize="sm">
                  {`Vote ended ${over} block${over > 1 ? "s" : ""} ago`}
                </Text>
              )}
            </Skeleton>
          </VStack>

          <Section>
            <Skeleton isLoaded={!loading} width="100%">
              {/* Votes For */}
              <Flex width="100%">
                <Flex width={{ base: "80%", md: "66%" }}>
                  <VoteCard
                    title="In Support"
                    subtitle={numeral(voteTotals?.yesTotal).format("0,0")}
                    description={`${voteTotals?.yesCount || 0} votes`}
                    src="https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif"
                    voteTotals={voteTotals && createYes(voteTotals)}
                  />
                </Flex>
              </Flex>
              {/* Votes Against */}
              <Flex width="100%" justifyContent="flex-end" mt="1">
                <Flex width={{ base: "80%", md: "66%" }}>
                  <VoteCard
                    title="Against"
                    src="https://media.giphy.com/media/gtG7xKn2vqzufFynnl/giphy.gif"
                    subtitle={numeral(voteTotals?.noTotal).format("0,0")}
                    description={`${voteTotals?.noCount || 0} votes`}
                    against
                    voteTotals={voteTotals && createNo(voteTotals)}
                  />
                </Flex>
              </Flex>
            </Skeleton>
          </Section>

          {/* CCIP Voting */}
          {!isSignedIn && status === "active" && (
            <Section>
              <Center>
                <Button
                  width={{ base: "100%", md: "90%" }}
                  variant="solid"
                  colorScheme="green"
                  onClick={() => handleSignIn()}
                >
                  Login To Vote
                </Button>
              </Center>
            </Section>
          )}
          {status === "active" && isSignedIn && (
            <Section>
              <VStack align="start" spacing={10}>
                <Heading size="lg">Cast Your Vote</Heading>
                <SimpleGrid columns={[1, 2]} spacing={8} mt={8} w="100%">
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
          {/* CCIP Description */}
          <Section>
            <VStack spacing={10} align="start" fontSize="1xl">
              <Heading size="lg">Description</Heading>
              <Text>{ccip.description}</Text>
            </VStack>
          </Section>
          <Section>
            <VStack spacing={10} align="start" fontSize="1xl">
              <Heading size="lg">CCIPS</Heading>
              {ccip.readForYourself.map((read) => {
                return (
                  <Link href={read.url} target="_blank" key={read.id}>
                    Read {read.id} for yourself
                    <ArrowForwardIcon marginLeft={8} />
                  </Link>
                );
              })}
            </VStack>
          </Section>
        </VStack>
      </Box>
    </PageTransition>
  );
}
