import { TransactionToSign } from '@/models/Transaction';
import { AlgoRealmWallet, WalletType } from '@/models/Wallet';
import {
  assignGroupID,
  LogicSigAccount,
  signLogicSigTransactionObject,
} from 'algosdk';
import MnemonicClient from './mnemonic';
import WalletConnectClient, { WalletConnectSingleton } from './walletConnect';

export default class WalletManager {
  private client: AlgoRealmWallet | undefined;

  public setWalletClient = (walletType: WalletType, phrase?: string) => {
    if (walletType === WalletType.PeraWallet) {
      this.client = new WalletConnectClient(WalletConnectSingleton.Instance);
    } else {
      const mnemonic = process.env.NEXT_PUBLIC_MNEMONIC ?? phrase ?? ``;
      this.client = new MnemonicClient(mnemonic);
    }
  };

  public connect = async (): Promise<void> => {
    if (this.client) {
      return this.client.connect();
    } else {
      throw new Error(`Client not set`);
    }
  };

  public disconnect = async (): Promise<void> => {
    if (this.client) {
      await this.client.disconnect();
    } else {
      throw new Error(`Client not set`);
    }
  };

  public signTransactions = async (transactions: TransactionToSign[]) => {
    if (this.client) {
      const rawTxns = [...transactions.map((txn) => txn.transaction)];
      const txnGroup = assignGroupID(rawTxns);

      const signedUserTransactionsResult = await this.client.signTransactions(
        txnGroup,
      );

      const signedUserTransactions: (Uint8Array | null)[] =
        signedUserTransactionsResult.map((element: string) => {
          return element
            ? new Uint8Array(Buffer.from(element, `base64`))
            : null;
        });

      const signedTxs = signedUserTransactions.map((signedTx, index) => {
        if (signedTx === null) {
          const signedEscrowTx = signLogicSigTransactionObject(
            txnGroup[index],
            transactions[index].signer as LogicSigAccount,
          );

          return signedEscrowTx.blob;
        } else {
          return signedTx;
        }
      }) as Uint8Array[];

      return signedTxs;
    } else {
      throw new Error(`Client not set`);
    }
  };

  public getWalletClient = (): AlgoRealmWallet => {
    if (this.client) {
      return this.client;
    } else {
      throw new Error(`Client not set`);
    }
  };

  public accounts = (): string[] => {
    if (this.client) {
      return this.client.accounts();
    } else {
      throw new Error(`Client not set`);
    }
  };

  get connected(): boolean {
    return Boolean(this.client && this.client.connected());
  }
}
