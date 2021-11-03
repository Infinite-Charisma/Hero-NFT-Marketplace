import {
  AccountInfo,
  Connection,
} from '@solana/web3.js';
import * as borsh from 'borsh';
import { AccountAndPubkey, Herodata, METADATA_SCHEMA } from '../types';
import log from 'loglevel';

/*
 Get accounts by candy machine creator address
 Get only verified ones
 Get only unverified ones with creator address
 Grab n at a time and batch sign and send transaction

 PS: Don't sign candy machine addresses that you do not know about. Signing verifies your participation.
*/
export async function getAllHeros(
  connection: Connection,
  heroProgramAddress: string,
) {
  const result = await getProgramAccounts(
    connection,
    heroProgramAddress,
    {},
  );
  log.info(`Fetched hero counts: ${result.length}`);
  let heroList = [];
  for(let hero of result) {
    const decoded = await decodeMetadata(hero.account.data);
    const accountPubkey = hero.pubkey;
    heroList.push({
      pubkey: accountPubkey,
      data: decoded,
    });
  };
  return heroList;
}

async function getProgramAccounts(
  connection: Connection,
  programId: String,
  configOrCommitment?: any,
): Promise<Array<AccountAndPubkey>> {
  const extra: any = {};
  let commitment;
  //let encoding;

  if (configOrCommitment) {
    if (typeof configOrCommitment === 'string') {
      commitment = configOrCommitment;
    } else {
      commitment = configOrCommitment.commitment;
      //encoding = configOrCommitment.encoding;

      if (configOrCommitment.dataSlice) {
        extra.dataSlice = configOrCommitment.dataSlice;
      }

      if (configOrCommitment.filters) {
        extra.filters = configOrCommitment.filters;
      }
    }
  }

  const args = connection._buildArgs([programId], commitment, 'base64', extra);
  const unsafeRes = await (connection as any)._rpcRequest(
    'getProgramAccounts',
    args,
  );
  //console.log(unsafeRes)
  const data = (
    unsafeRes.result as Array<{
      account: AccountInfo<[string, string]>;
      pubkey: string;
    }>
  ).map(item => {
    return {
      account: {
        // TODO: possible delay parsing could be added here
        data: Buffer.from(item.account.data[0], 'base64'),
        executable: item.account.executable,
        lamports: item.account.lamports,
        // TODO: maybe we can do it in lazy way? or just use string
        owner: item.account.owner,
      } as AccountInfo<Buffer>,
      pubkey: item.pubkey,
    };
  });

  return data;
}

async function decodeMetadata(buffer) {
  return borsh.deserializeUnchecked(METADATA_SCHEMA, Herodata, buffer);
}