import axios from 'axios';

export async function enrichData(transaction: Transaction): Promise<Transaction> {
  try {
    const conversionRate = await getConversionRate(transaction.transactionDetails.currency, 'USD');
    transaction.transactionDetails.amountUSD = transaction.transactionDetails.amount * conversionRate;
    return transaction;
  } catch (error) {
    throw new Error('Error enriching data: ' + error.message);
  }
}

async function getConversionRate(fromCurrency: string, toCurrency: string): Promise<number> {
  // Example API call to fetch conversion rate
  const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`);
  const data = response.data;
  return data.rates[toCurrency];
}
