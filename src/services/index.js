import { fetchReadOnlyFunction } from "micro-stacks/api";
import { StacksMainnet, StacksMocknet } from "micro-stacks/network";

export const STACKS_NETWORK = new StacksMocknet();
// process.env === "development" ? new StacksMocknet() : new StacksMainnet();

export async function callContract(config, args = []) {
  return fetchReadOnlyFunction(
    {
      contractAddress: config.contractAddress,
      contractName: config.contractName,
      functionName: config.functionName,
      functionArgs: args,
      network: STACKS_NETWORK,
      senderAddress: config.contractAddress,
    },
    true
  );
}
