/* eslint-disable */
import {
    isWeb3Injected,
    web3Accounts,
    web3Enable,
    web3FromAddress
} from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
import {
    mnemonicGenerate,
    mnemonicToMiniSecret,
    setAddressPrefix,
    naclKeypairFromSeed,
    schnorrkelKeypairFromSeed,
    encodeAddress,
    decodeAddress,
    naclSign,
    blake2AsU8a,
    schnorrkelSign,
    cryptoWaitReady
} from "@polkadot/util-crypto";

web3Enable("polkadot samples");

class PolkadotUtils {
    async createAccount() {
        await cryptoWaitReady()
        const mnemonic = mnemonicGenerate(12);
        const seed = mnemonicToMiniSecret(mnemonic, "");

        const keypair = schnorrkelKeypairFromSeed(seed);
        return encodeAddress(keypair.publicKey, 42);
    }
    async login() {
        // returns an array of { address, meta: { name, source } }
        if (!isWeb3Injected) {
            throw new Error("Please install Math Extension first");
        }
        // meta.source contains the name of the extension that provides this account
        const allAccounts = await web3Accounts();
        return allAccounts;
    }
    async transfer(from, to, amount) {
        // Initialise the provider to connect to the local node
        const provider = new WsProvider('wss://poc3-rpc.polkadot.io');
        // Create the API and wait until ready
        const api = await ApiPromise.create(provider);
        // finds an injector for an address
        const injector = await web3FromAddress(from);

        // sets the signer for the address on the @polkadot/api
        api.setSigner(injector.signer);

        // sign and send out transaction - notice here that the address of the account (as retrieved injected)
        // is passed through as the param to the `signAndSend`, the API then calls the extension to present
        // to the user and get it signed. Once completex, the api sends the tx + signature via the normal process
        return api.tx.balances
            .transfer(to, amount)
            .signAndSend(from);
    }
}

const PolkadotUtilsInstace = new PolkadotUtils();
export default PolkadotUtilsInstace;