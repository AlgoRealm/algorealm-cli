const lineSeparator = `================`;

export const getAlgoRealmHistory = (algorealmCalls: any[]) => {
  const claimsHistory = [];

  for (const call of algorealmCalls) {
    const callArgs = call[`application-transaction`][`application-args`];

    if (callArgs.length === 2) {
      const block = call[`confirmed-round`];
      const nft = Buffer.from(callArgs[0], `base64`).toString();
      let name = ``;
      const donation = call[`global-state-delta`][0][`value`][`uint`];
      if (call[`global-state-delta`].length === 2) {
        name = Buffer.from(
          call[`global-state-delta`][1][`value`][`bytes`],
          `base64`,
        ).toString();
      }

      if (nft === `Crown`) {
        claimsHistory.push(
          `\n👑 ${name} claimed the Crown of Entropy \n
                        on Block: ${block} donating: ${donation / 1e6} Algos \
                        to the Rewards Pool.\n\n`,
        );
      }
      if (nft === `Sceptre`) {
        claimsHistory.push(
          `\n🔮 ${name} claimed the Sceptre of Proof \n
                        on Block: ${block} donating: ${donation / 1e6} Algos \
                        to the Rewards Pool.\n\n`,
        );
      }
    }
  }

  return claimsHistory.join(lineSeparator);
};
