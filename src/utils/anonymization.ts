import * as crypto from 'crypto';
import { Transaction } from '../models/transaction';

export function anonymizeIdentifier(id: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(id);
  return hash.digest('hex');
}

export function anonymizeData(transaction: Transaction): Transaction {
  transaction.userId = anonymizeIdentifier(transaction.userId);
  transaction.userDetails.firstName = anonymizeIdentifier(transaction.userDetails.firstName);
  transaction.userDetails.lastName = anonymizeIdentifier(transaction.userDetails.lastName);
  transaction.userDetails.email = anonymizeIdentifier(transaction.userDetails.email);
  transaction.userDetails.phone = anonymizeIdentifier(transaction.userDetails.phone);
  return transaction;
}
