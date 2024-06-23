import * as fs from 'fs';
import { Transaction } from '../models/transaction';

const DATA_FILE_PATH = 'processed_data.json';

export function storeDataLocally(data: any): void {
  let existingData: Transaction[] = [];
  if (fs.existsSync(DATA_FILE_PATH)) {
    const dataStr = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    existingData = JSON.parse(dataStr);
  }
  existingData.push(data);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(existingData));
}

export function retrieveDataLocally(identifier: string): Transaction | undefined {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    return undefined;
  }
  const dataStr = fs.readFileSync(DATA_FILE_PATH, 'utf8');
  const existingData: Transaction[] = JSON.parse(dataStr);
  return existingData.find((item: Transaction) => item.transactionId === identifier);
}
