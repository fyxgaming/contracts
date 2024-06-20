import type { Contract, BytesLike } from 'ethers';

export function getSelectors(
  contract: Contract,
  excluded: string[] = ['init(bytes)', 'supportsInterface(bytes4)']
): BytesLike[] {
  const signatures: string[] = Object.keys(contract.interface.functions);
  const selectors: string[] = signatures.reduce<string[]>((acc, val) => {
    if (!excluded.includes(val)) {
      const sighash = contract.interface.getSighash(val);
      acc.push(sighash);
    }
    return acc;
  }, []);

  return selectors;
}
