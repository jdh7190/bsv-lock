# bsv-lock

## Introduction

This code implements locking and unlocking functions, along with bSocial [(Bitcoin Schema, Open Social)](https://bitcoinschema.org/) interactions on-chain.

The code is designed for web browser use with the [legacy bsv library](https://github.com/moneybutton/bsv/tree/bsv-legacy) (requires version 1.5.6) but could be easily leveraged and/or ported to Node JS.

This code also contains a wallet plugin, located in SHUAllet.js that will pay for transactions.

### Setup

Create an HTML file with script tags in order, per the example index.html file in this repository.

### Locking

To lock coins into a Bitcoin script at a specified block height, call the lock coins function specifying the address to lock coins to (and corresponding private key that can unlock), block height to lock to, and amount of satoshis to lock.

Optionally, specify a private key in WIF format to sign bSocial functions via [AIP (Author Identity Protocol)](https://github.com/attilaaf/AUTHOR_IDENTITY_PROTOCOL).

Specify text content to embed a bSocial Post OR a txid to Like. If Liking, optionally specify an emoji - see [Loolock Clout Theory (LCT)](https://jadwahab.gitbook.io/loolock-clout-theory-lct/) for more details and inspiration.

Thanks to [Siggi](https://github.com/icellan) for the base [bSocial functions](https://github.com/icellan/bsocial).

The lockCoins() function returns a raw transaction with only outputs. To pay for it, call the payForRawTx() that will provide a signed input and change for the outputs.

Notice that in the locking script, the hex of the P2PKH output (address) is located in the 6th pushdata, and the reversed hex value of the integer block height is located in the 7th pushdata of the locking script.

The hex reversing logic is implemented in the following helper functions in locks.js:

```JavaScript
int2Hex()
hex2Int()
```

### Unlocking

To unlock, call the unlockCoins() function specifying the WIF private key that can sign against the address that was locked, the receive address to send the satoshis to, the txid of the locking script and optionally the output index of the locking script (this defaults to 0).

This function will fetch the raw transaction from WhatsOnChain, create the input, inspect its block height and set this transactions nLockTime equal to the block height specified in the locking script.

An output will be created with the locked amount of satoshis, subtracting 1 satoshi to pay the transaction fee.

The solution is created for the locking script which is:

```
<Signature> <PublicKey> <preimage>
```

Note that the solution is nearly identical to unlocking normal P2PKH outputs (sends to Bitcoin addresses) with the addition being the preimage of the current transaction with nLockTime set (this logic is implemented in the unlockLockScript function).

This preimage leverages the [OP_PUSH_TX](https://xiaohuiliu.medium.com/op-push-tx-3d3d279174c1) technique that allows for stateful inspection of data of Bitcoin's transaction to validate scripts.

Also note that the code defaults to a single output, but could be modified to any outputs the unlocker desires.

### SHUAllet.js

To get started in the browser, open the console and call setupWallet().

This function will create two keys, one to hold satoshis and pay for transactions and designed for ownership and signing and/or encrypting data.

The function will also download the keys into a shuallet.json file for backing up.

This plugin contains several other functions for a simple Bitcoin wallet, see the file for more.