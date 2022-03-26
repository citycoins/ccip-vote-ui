import { fetchReadOnlyFunction } from "micro-stacks/api";
import { StacksMainnet, StacksMocknet } from "micro-stacks/network";

export const STACKS_NETWORK =
  process.env === "development" ? new StacksMocknet() : new StacksMainnet();

export async function callContract(config) {
  return fetchReadOnlyFunction(
    {
      contractAddress: config.contractAddress,
      contractName: config.contractName,
      functionName: config.functionName,
      functionArgs: [],
      network: STACKS_NETWORK,
      senderAddress: config.contractAddress,
    },
    true
  );
}
