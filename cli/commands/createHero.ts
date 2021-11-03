import {
  createAssociatedTokenAccountInstruction,
  createMetadataInstruction,
  createMasterEditionInstruction,
} from '../helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';
import {
  getTokenWallet,
  getMetadata,
  getMasterEdition,
} from '../helpers/accounts';
import * as anchor from '@project-serum/anchor';
import {
  Data,
  Creator,
  CreateMetadataArgs,
  CreateMasterEditionArgs,
  METADATA_SCHEMA,
} from '../helpers/schema';
import { serialize } from 'borsh';
import { TOKEN_PROGRAM_ID } from '../helpers/constants';
import fetch from 'node-fetch';
import { MintLayout, Token } from '@solana/spl-token';
import {
  Keypair,
  Connection,
  SystemProgram,
  TransactionInstruction,
  PublicKey,
} from '@solana/web3.js';
import BN from 'bn.js';
import log from 'loglevel';

export const createNewHero = async (
  connection: Connection,
  heroProgramAddress: string,
  walletKeypair: Keypair,
  heroData: {
    name: string,
    uri: string,
    price: number,
    ownerNftAddress: PublicKey,
  }
): Promise<{
  herodataAccount: PublicKey;
} | void> => {
  // Validate heroData
  if (
    !heroData.name ||
    !heroData.uri ||
    isNaN(heroData.price) ||
    !heroData.ownerNftAddress
  ) {
    log.error('Invalid heroData', heroData);
    return;
  }

  log.info(heroData);
  // Create wallet from keypair
  const wallet = new anchor.Wallet(walletKeypair);
  if (wallet?.publicKey) return;

  // // Generate a mint
  // const mint = anchor.web3.Keypair.generate();
  // const instructions: TransactionInstruction[] = [];
  // const signers: anchor.web3.Keypair[] = [mint, walletKeypair];

  // instructions.push(
  //   SystemProgram.createAccount({
  //     fromPubkey: wallet.publicKey,
  //     newAccountPubkey: mint.publicKey,
  //     lamports: mintRent,
  //     space: MintLayout.span,
  //     programId: TOKEN_PROGRAM_ID,
  //   }),
  // );
  // instructions.push(
  //   Token.createInitMintInstruction(
  //     TOKEN_PROGRAM_ID,
  //     mint.publicKey,
  //     0,
  //     wallet.publicKey,
  //     wallet.publicKey,
  //   ),
  // );

  // const userTokenAccoutAddress = await getTokenWallet(
  //   wallet.publicKey,
  //   mint.publicKey,
  // );
  // instructions.push(
  //   createAssociatedTokenAccountInstruction(
  //     userTokenAccoutAddress,
  //     wallet.publicKey,
  //     wallet.publicKey,
  //     mint.publicKey,
  //   ),
  // );

  // // Create metadata
  // const metadataAccount = await getMetadata(mint.publicKey);
  // const creators = metaCreators.map(
  //   creator =>
  //     new Creator({
  //       address: creator.address,
  //       share: creator.share,
  //       verified: 1,
  //     }),
  // );
  // const data = new Data({
  //   symbol: metadata.symbol,
  //   name: metadata.name,
  //   uri: metadataLink,
  //   sellerFeeBasisPoints: metadata.seller_fee_basis_points,
  //   creators: creators,
  // });

  // let txnData = Buffer.from(
  //   serialize(
  //     METADATA_SCHEMA,
  //     new CreateMetadataArgs({ data, isMutable: mutableMetadata }),
  //   ),
  // );

  // instructions.push(
  //   createMetadataInstruction(
  //     metadataAccount,
  //     mint.publicKey,
  //     wallet.publicKey,
  //     wallet.publicKey,
  //     wallet.publicKey,
  //     txnData,
  //   ),
  // );

  // instructions.push(
  //   Token.createMintToInstruction(
  //     TOKEN_PROGRAM_ID,
  //     mint.publicKey,
  //     userTokenAccoutAddress,
  //     wallet.publicKey,
  //     [],
  //     1,
  //   ),
  // );

  // // Create master edition
  // const editionAccount = await getMasterEdition(mint.publicKey);
  // txnData = Buffer.from(
  //   serialize(
  //     METADATA_SCHEMA,
  //     new CreateMasterEditionArgs({ maxSupply: new BN(0) }),
  //   ),
  // );

  // instructions.push(
  //   createMasterEditionInstruction(
  //     metadataAccount,
  //     editionAccount,
  //     mint.publicKey,
  //     wallet.publicKey,
  //     wallet.publicKey,
  //     wallet.publicKey,
  //     txnData,
  //   ),
  // );

  // const res = await sendTransactionWithRetryWithKeypair(
  //   connection,
  //   walletKeypair,
  //   instructions,
  //   signers,
  // );

  // try {
  //   await connection.confirmTransaction(res.txid, 'max');
  // } catch {
  //   // ignore
  // }

  // // Force wait for max confirmations
  // await connection.getParsedConfirmedTransaction(res.txid, 'confirmed');
  // log.info('NFT created', res.txid);
  // return { metadataAccount };
};
