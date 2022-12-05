/**
 * AlgoRealm
 * Copyright (C) 2022 AlgoRealm
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChainType } from '@/models/Chain';
import getLogicSign from '@/utils/accounts/getLogicSignature';

export const CHAIN_TYPE: ChainType =
  (process.env.NEXT_PUBLIC_CHAIN_TYPE ?? `TestNet`) === `TestNet`
    ? ChainType.TestNet
    : ChainType.MainNet;

export const SITE_IS_UNDER_MAINTENANCE =
  process.env.NEXT_PUBLIC_UNDER_MAINTENANCE === `true`;

export const ALGOEXPLORER_API_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `https://node.algoexplorerapi.io`
    : `https://node.testnet.algoexplorerapi.io`;
};

export const ALGOEXPLORER_INDEXER_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `https://algoindexer.algoexplorerapi.io`
    : `https://algoindexer.testnet.algoexplorerapi.io`;
};

export const ALGONODE_INDEXER_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `	https://mainnet-idx.algonode.cloud`
    : `https://testnet-idx.algonode.cloud`;
};

export const ALGOEXPLORER_URL = (chain: ChainType) => {
  return chain.toLowerCase() === `mainnet`
    ? `https://algoexplorer.io`
    : `https://testnet.algoexplorer.io`;
};

export const CONNECTED_WALLET_TYPE = `CONNECTED_WALLET_TYPE`;

export const ALGOREALM_FIRST_BLOCK = (chain: ChainType) => {
  return chain === ChainType.MainNet ? 13578170 : 14739865;
};
export const ALGOREALM_APP_ID = (chain: ChainType) => {
  return chain === ChainType.MainNet ? 137491307 : 16258432;
};
export const ALGOREALM_CROWN_ID = (chain: ChainType) => {
  return chain === ChainType.MainNet ? 137493252 : 16258490;
};
export const ALGOREALM_SCEPTRE_ID = (chain: ChainType) => {
  return chain === ChainType.MainNet ? 137494385 : 16258497;
};

export const ALGOREALM_POEM = `
◦,-----------------------------------------.
(_\\◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\\
◦◦◦|◦◦There◦was◦a◦time◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦|
◦◦◦|◦◦When◦nothing◦but◦Entropy◦was◦there.◦◦◦◦|
◦◦◦|◦◦Then◦came◦the◦cryptographic◦Proof,◦◦◦◦◦|
◦◦◦|◦◦And◦took◦it◦care.◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦|
◦◦◦|◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦|
◦◦◦|◦◦Verifiability◦of◦Randomness,◦◦◦◦◦◦◦◦◦◦◦|
◦◦◦|◦◦Since◦genesis◦block,◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦|
◦◦◦|◦◦Brings◦Consensus◦over◦realm◦vastness,◦◦|
◦◦◦|◦◦So◦Algorand◦shall◦not◦fork.◦◦◦◦◦◦◦◦◦◦◦◦|
◦◦_|◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦|
◦(_/___________________(*)___________________/
◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\\\◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦
◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦))◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦
◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦^◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦
    `;

export const ALGOREALM_REWARDS_POOL = `737777777777777777777777777777777777777777777777777UFEJ2CI`;
const ALGOREALM_LAW_BYTECODE = (chain: ChainType) => {
  return chain === ChainType.MainNet
    ? `AiAIAwbr5sdBAQSE9sdB8f7HQegHJgEg/v////////////////////////////////////////8yBCISMwAQIxIzABgkEhAQMwEQJRIzAQAzAAASEDMBBygSEBAzAhAhBBIzAhQzAQASEDMCESEFEjMCESEGEhEQMwISJRIQMwIBIQcOEDMCFTIDEhAzAiAyAxIQEA==`
    : `AiAIAwaAq+AHAQS6q+AHwavgB+gHJgEg/v////////////////////////////////////////8yBCISMwAQIxIQMwAYJBIQMwEQJRIQMwAAMwEAEhAzAQcoEhAzAhAhBBIQMwIUMwEAEhAzAhEhBRIzAhEhBhIREDMCEiUSEDMCASEHDhAzAhUyAxIQMwIgMgMSEA==`;
};

export const ALGOREALM_LAW_LSIG = (chain: ChainType) => {
  return getLogicSign(ALGOREALM_LAW_BYTECODE(chain));
};
