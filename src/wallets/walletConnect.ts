import { AlgoWorldWallet, WalletType } from '@/models/Wallet';
import { encodeAddress, Transaction } from 'algosdk';
import store from '@/redux/store';
import { onSessionUpdate } from '@/redux/slices/walletConnectSlice';
import { CONNECTED_WALLET_TYPE } from '@/common/constants';
import { PeraWalletConnect } from '@perawallet/connect';

export class WalletConnectSingleton {
  private static _instance: PeraWalletConnect;

  private constructor() {
    //...
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new PeraWalletConnect());
  }
}

export default class WalletConnectClient implements AlgoWorldWallet {
  private client: PeraWalletConnect;

  constructor(client: PeraWalletConnect) {
    this.client = client;
  }

  public connect = async () => {
    if (this.client.isConnected) return;
    const accounts = await this.client.connect();

    if (this.client.connector) {
      this.client.connector.on(`disconnect`, this.disconnect);
    }

    localStorage.setItem(CONNECTED_WALLET_TYPE, WalletType.PeraWallet);
    store.dispatch(onSessionUpdate(accounts));
  };

  public address = () => {
    return ``;
  };

  public accounts = () => {
    return this.client.connector?.accounts || [];
  };

  public signTransactions = async (txnGroup: Transaction[]) => {
    if (!this.client.isConnected) {
      throw new Error(`Client not connected`);
    }

    const txns = txnGroup.map((txn) => {
      if (
        this.client.connector?.accounts[0] === encodeAddress(txn.from.publicKey)
      ) {
        return [{ txn: txn, signers: [this.client.connector?.accounts[0]] }];
      } else {
        return [];
      }
    });

    return await this.client.signTransaction(txns);
  };

  public disconnect = async () => {
    if (this.client && this.client.isConnected) {
      localStorage.removeItem(CONNECTED_WALLET_TYPE);
      await this.client.disconnect();
    } else {
      return Promise.resolve();
    }
  };

  public connected = () => {
    return this.client.isConnected;
  };
}
