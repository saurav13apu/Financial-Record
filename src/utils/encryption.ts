import * as aes256 from 'aes256';
import * as crypto from 'crypto';
import { publicKey, privateKey } from './cryptoKeys';  //keys are stored in a separate file

export function encryptData(data: any): any {
  const aesKey = crypto.randomBytes(32).toString('hex');
  const encryptedData = aes256.encrypt(aesKey, JSON.stringify(data));
  const encryptedKey = crypto.publicEncrypt(publicKey, Buffer.from(aesKey));
  return { encryptedData, encryptedKey: encryptedKey.toString('hex') };
}

export function decryptData(encryptedData: any, encryptedKey: any): any {
  const aesKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedKey, 'hex')).toString();
  const decryptedData = aes256.decrypt(aesKey, encryptedData);
  return JSON.parse(decryptedData);
}
