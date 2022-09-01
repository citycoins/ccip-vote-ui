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

import {
  fPrincipal,
  createNo,
  createYes,
  createStatus,
  fromMicro,
} from "../src/utils";

const ccip = {
  descriptions: [
    "Over the summer, CityCoiners have been working on a plan to stabilize the protocol and optimize for future development, experimentation, and growth.",
    "Community discussions and feedback have resulted in a four-phase proposal designed to stabilize the protocol. The phases have been split into two separate CityCoins Improvement Proposals (CCIPs).",
    "CCIP-012 is the first of two proposals that will be voted on by the community. This proposal includes a 2% emissions model and moving treasuries to smart contract vaults.",
    "Votes will be recorded by a smart contract and tallied based on the amount an address has stacked in MiamiCoin cycles 21 and 22 and NewYorKCityCoin cycles 15 and 16.",
    "The vote will start at Stacks block 74,300 and last approximately 2 weeks. For more details, see CCIP-012.",
  ],
  contractAddress: "SP119FQPVQ39AKVMC0CN3Q1ZN3ZMCGMBR52ZS5K6E",
  contractName: "operational-chocolate-seahorse",
  readForYourself: [
    {
      id: "CCIP-012",
      url: "https://github.com/citycoins/governance/blob/main/ccips/ccip-012/ccip-012-stabilize-emissions-and-treasuries.md",
      title: "Stabilize Emissions and Treasuries",
    },
    {
      id: "Blog",
      url: "https://www.citycoins.co/post/citycoins-protocol-upgrade-2",
      title: "CityCoins Protocol Upgrade #2",
    },
    {
      id: "Status",
      url: "https://github.com/citycoins/governance/discussions/9",
      title: "CCIP-012 / CCIP-013 Remaining Work Items",
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
        console.log(`totals: ${JSON.stringify(totals)}`);
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
                  subtitle={numeral(fromMicro(voteTotals?.yesTotal)).format(
                    "0,0"
                  )}
                  description={`${voteTotals?.yesCount || 0} votes`}
                  src="https://media.giphy.com/media/3o6UB3VhArvomJHtdK/giphy.gif"
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
                  src="https://media.giphy.com/media/3o7TKGVqdQdyGb3aDe/giphy.gif"
                  subtitle={numeral(fromMicro(voteTotals?.noTotal)).format(
                    "0,0"
                  )}
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
