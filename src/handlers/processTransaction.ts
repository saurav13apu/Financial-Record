import { APIGatewayProxyHandler } from 'aws-lambda';
import { encryptData } from '../utils/encryption';
import { calculateAggregateRiskScore } from '../utils/riskAssessment';
import { anonymizeData } from '../utils/anonymization';
import { enrichData } from '../services/externalAPI';
import { storeDataLocally } from '../services/storage';
import { retrieveDataLocally } from '../services/storage';
import { Transaction } from '../models/transaction';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const transaction: Transaction = JSON.parse(event.body);
    const anonymizedData = anonymizeData(transaction);
    const enrichedData = await enrichData(anonymizedData);
    const riskScore = calculateAggregateRiskScore(enrichedData);
    const encryptedData = encryptData({ ...enrichedData, riskScore });
    storeDataLocally(encryptedData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Transaction processed successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing transaction', error })
    };
  }
};
