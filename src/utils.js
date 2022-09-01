export function fPrincipal(princ) {
  return `${princ?.substr(0, 5)}...${princ?.substr(princ.length - 5)}`;
}

export const micro = 1000000;
export const fromMicro = (ustx) => (ustx / micro).toFixed(6);

export const createYes = (voteTotals) => {
  return [
    {
      label: "Totals",
      value: fromMicro(voteTotals.yesTotal),
    },
    {
      label: "Voters",
      value: voteTotals.yesCount,
    },
  ];
};

export const createNo = (voteTotals) => {
  return [
    {
      label: "Totals",
      value: fromMicro(voteTotals.noTotal),
    },
    {
      label: "Voters",
      value: voteTotals.noCount,
    },
  ];
};

export const createStatus = ({ startBlock, endBlock }, currHeight) => {
  const start = parseInt(startBlock);
  const end = parseInt(endBlock);

  if (currHeight >= end) {
    return "over";
  }

  if (currHeight >= start) {
    return "active";
  }

  if (currHeight <= start) {
    return "not_started_yet";
  }
  return "not_initialized";
};
