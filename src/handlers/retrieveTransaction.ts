import { APIGatewayProxyHandler } from 'aws-lambda';
import { retrieveDataLocally } from '../services/storage';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const transactionId = event.pathParameters?.id;
    if (!transactionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Transaction ID is required' })
      };
    }
    
    const transaction = retrieveDataLocally(transactionId);
    if (!transaction) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Transaction not found' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(transaction)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving transaction', error })
    };
  }
};
