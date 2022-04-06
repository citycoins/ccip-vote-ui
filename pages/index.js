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
  SkeletonText,
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
  descriptions: [
    'The CityCoins community is proposing an update to the emissions schedule for current and future CityCoins. The update will adjust/compress the emissions schedule with "halvings" based on a doubling epoch model with an initial bonus period, in which the length of each epoch is twice as long as the last following epoch 1. For more details, see CCIP-008.',
    "This also presents the opportunity to add some minor features to the CityCoins protocol, including token divisibility, an upgraded VRF contract with performance improvements and modification to the auth contract to allow for more flexibility in the future. For more details, see CCIP-009 and CCIP-010.",
    "Votes will be recorded by a smart contract and tallied based on the amount an address has stacked in MiamiCoin cycles 12 and 13 and NewYorKCityCoin cycles 6 and 7. The vote will start around Stacks block 55,150 and last approximately 2 weeks. For more details, see CCIP-011.",
  ],
  url: "https://github.com/citycoins/governance/blob/main/ccips/ccip-011/ccip-011-citycoins-stacked-tokens-voting.md",
  contractAddress: "SP34FHX44NK9KZ8KJC08WR2NHP8NEGFTTT7MTH7XD",
  contractName: "citycoins-vote-v1",
  readForYourself: [
    {
      id: "CCIP-008",
      url: "https://github.com/citycoins/governance/blob/main/ccips/ccip-008/ccip-008-citycoins-sip-010-token-v2.md",
      title: "CityCoins SIP-010 Token v2",
    },
    {
      id: "CCIP-009",
      url: "https://github.com/citycoins/governance/blob/main/ccips/ccip-009/ccip-009-citycoins-vrf-v2.md",
      title: "CityCoins VRF V2",
    },
    {
      id: "CCIP-010",
      url: "https://github.com/citycoins/governance/blob/main/ccips/ccip-010/ccip-010-citycoins-auth-v2.md",
      title: "CityCoins Auth V2",
    },
    {
      id: "CCIP-011",
      url: "https://github.com/citycoins/governance/blob/main/ccips/ccip-011/ccip-011-citycoins-stacked-tokens-voting.md",
      title: "CityCoins Stacked Tokens Voting",
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
              contractAddress: ccip.contractAddress,
              contractName: ccip.contractName,
              functionName: "get-voter-info",
            },
            [principalCV(address)]
          );
          setUserVote(userVotes === "8000" ? false : userVotes);
        }

        // fetch voting data from contract
        const [totals, startEnd] = await Promise.all([
          callContract({
            contractAddress: ccip.contractAddress,
            contractName: ccip.contractName,
            functionName: "get-proposal-votes",
          }),
          callContract({
            contractAddress: ccip.contractAddress,
            contractName: ccip.contractName,
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
            <Heading size="xl">CityCoins Upgrade Vote</Heading>
            <SkeletonText isLoaded={!loading} noOfLines={1}>
              {status !== "not_initialized" && (
                <Text fontSize="sm">
                  {`Voting Active Blocks ${contractStartEnd.startBlock} - ${contractStartEnd.endBlock}`}
                </Text>
              )}
              {status === "not_initialized" && (
                <Text fontSize="sm">
                  {"Voting contract hasn't been initialized"}
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
                  {`Vote ended ${over} block${over == 1 ? "" : "s"} ago`}
                </Text>
              )}
            </SkeletonText>
          </VStack>

          <Section>
            {/* Votes For */}
            <Flex width="100%">
              <Flex width={{ base: "100%", md: "66%" }}>
                <VoteCard
                  title="In Support"
                  subtitle={numeral(voteTotals?.yesTotal).format("0,0")}
                  description={`${voteTotals?.yesCount || 0} votes`}
                  src="https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif"
                  voteTotals={voteTotals && createYes(voteTotals)}
                  loading={loading}
                />
              </Flex>
            </Flex>
            {/* Votes Against */}
            <Flex width="100%" justifyContent="flex-end" mt="1">
              <Flex width={{ base: "100%", md: "66%" }}>
                <VoteCard
                  title="Against"
                  src="https://media.giphy.com/media/gtG7xKn2vqzufFynnl/giphy.gif"
                  subtitle={numeral(voteTotals?.noTotal).format("0,0")}
                  description={`${voteTotals?.noCount || 0} votes`}
                  against
                  voteTotals={voteTotals && createNo(voteTotals)}
                  loading={loading}
                />
              </Flex>
            </Flex>
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
                  Sign In To Vote
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
              {ccip.descriptions.map((ele, idx) => {
                return (
                  <Text fontSize={{ base: "xs", md: "lg" }} key={idx}>
                    {ele}
                  </Text>
                );
              })}
            </VStack>
          </Section>
          <Section>
            <VStack spacing={10} align="start" fontSize="1xl">
              <Heading size="lg">CCIPS</Heading>
              {ccip.readForYourself.map((read) => {
                return (
                  <Link
                    href={read.url}
                    target="_blank"
                    key={read.id}
                    fontSize={{ base: "xs", md: "lg" }}
                  >
                    Read {read.id}: {read.title}
                    <ArrowForwardIcon marginLeft={4} />
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
