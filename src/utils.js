export function fPrincipal(princ) {
  return `${princ?.substr(0, 5)}...${princ?.substr(princ.length - 5)}`;
}

export const createYes = (voteTotals) => {
  return [
    {
      label: "MIA",
      value: voteTotals.yesMia,
    },
    {
      label: "NYC",
      value: voteTotals.yesNyc,
    },
    {
      label: "Totals",
      value: voteTotals.yesTotal,
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
      label: "MIA",
      value: voteTotals.noMia,
    },
    {
      label: "NYC",
      value: voteTotals.noNyc,
    },
    {
      label: "Totals",
      value: voteTotals.noTotal,
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
