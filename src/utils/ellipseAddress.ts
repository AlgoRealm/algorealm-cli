export function ellipseAddress(address: string | null = ``, width = 6): string {
  if (!address) {
    return ``;
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}
