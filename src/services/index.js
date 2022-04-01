import { fetchReadOnlyFunction } from "micro-stacks/api";
import { StacksMainnet, StacksMocknet } from "micro-stacks/network";

export const STACKS_NETWORK = new StacksMainnet();

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

export async function getStacksBlockHeight() {
  const url = `${STACKS_NETWORK.getCoreApiUrl()}/v2/info`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.stacks_tip_height;
    });
}
