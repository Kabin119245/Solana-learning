import { Keypair, Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const filePath = './secret-key.json';
const fs = require('fs');
let keyData;
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

import {getExplorerLink} from "@solana-developers/helpers";

try {
  const data = fs.readFileSync(filePath, 'utf8');
  keyData = JSON.parse(data);
} catch (error) {
  console.error('Error reading key file:', error);
  process.exit(1);
}

const privateKey = keyData.secretKey;
const privateKeyUint8Array = new Uint8Array(privateKey);

const user = Keypair.fromSecretKey(privateKeyUint8Array);
const connection = new Connection(clusterApiUrl("devnet"));


console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

// Subtitute in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey(
  "FiGD5WEiZQAZCM8RpRxTJBC5MNUbwWHb5Cqfuu79M6V9"
);

// Here we are making an associated token account for our own address, but we can 
// make an ATA on any other wallet in devnet!
// const recipient = new PublicKey("SOMEONE_ELSES_DEVNET_ADDRESS");
const recipient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  recipient
);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
  "address",
  tokenAccount.address.toBase58(),
  "devnet"
);

console.log(`✅ Created token Account: ${link}`);