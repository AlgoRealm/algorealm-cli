export const getKeyByValue = (input: Record<string, any>, value: string) => {
  const indexOfS = Object.values(input).indexOf(
    value as unknown as Record<string, any>,
  );

  const key = Object.keys(input)[indexOfS];

  return key;
};
