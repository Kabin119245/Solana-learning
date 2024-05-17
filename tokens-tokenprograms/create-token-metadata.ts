// This uses "@metaplex-foundation/mpl-token-metadata@2" to create tokens

import { Keypair,Connection,clusterApiUrl,PublicKey,Transaction,sendAndConfirmTransaction } from "@solana/web3.js";

const filePath = './secret-key.json';
const fs = require('fs');
let keyData;



import {  getExplorerLink } from "@solana-developers/helpers";


import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";



try {
  const data = fs.readFileSync(filePath, 'utf8');
  keyData = JSON.parse(data);
} catch (error) {
  console.error('Error reading key file:', error);
  process.exit(1);
}

const privateKey = keyData.secretKey;
const privateKeyUint8Array = new Uint8Array(privateKey);

const keypair = Keypair.fromSecretKey(privateKeyUint8Array);

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The private key is: `, keypair.secretKey);



const connection = new Connection(clusterApiUrl("devnet"));

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Subtitute in your token mint account
const tokenMintAccount = new PublicKey("FiGD5WEiZQAZCM8RpRxTJBC5MNUbwWHb5Cqfuu79M6V9");

const metadataData = {
  name: "Solana Training Token",
  symbol: "TRAINING",
  // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
  uri: "https://arweave.net/1234",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const metadataPDAAndBump = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAccount.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);

const metadataPDA = metadataPDAAndBump[0];

const transaction = new Transaction();

const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAccount,
      mintAuthority: keypair.publicKey,
      payer: keypair.publicKey,
      updateAuthority: keypair.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null,
        data: metadataData,
        isMutable: true,
      },
    }
  );

transaction.add(createMetadataAccountInstruction);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [keypair]
);

const transactionLink = getExplorerLink(
  "transaction",
  transactionSignature,
  "devnet"
);

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}!`);

const tokenMintLink = getExplorerLink(
  "address",
  tokenMintAccount.toString(),
  "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);