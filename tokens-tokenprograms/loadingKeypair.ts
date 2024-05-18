import * as dotenv from 'dotenv';
dotenv.config();

import { getKeypairFromEnvironment } from '@solana-developers/helpers';


const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log("Public Key:", keypair.publicKey.toString());
console.log("Private Key:", keypair.secretKey);


