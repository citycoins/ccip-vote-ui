export function fPrincipal(princ) {
  return `${princ?.substr(0, 5)}...${princ?.substr(princ.length - 5)}`;
}
