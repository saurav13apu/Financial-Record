import { Transaction } from '../models/transaction';

const RISK_WEIGHTS = {
  amount: 0.4,
  frequency: 0.3,
  geographical: 0.2,
  pastBehavior: 0.1
};

const HIGH_RISK_AMOUNT_THRESHOLD = 1000;
const HIGH_FREQUENCY_THRESHOLD = 10;
const HIGH_RISK_LOCATIONS = ['NG', 'UA', 'RU'];

export function calculateAmountRisk(amount: number): number {
  if (amount > HIGH_RISK_AMOUNT_THRESHOLD) return 1.0;
  return amount / HIGH_RISK_AMOUNT_THRESHOLD;
}

export function calculateFrequencyRisk(transactionHistory: Transaction[], currentTransactionDate: string): number {
  const pastMonthTransactions = transactionHistory.filter(transaction => {
    const transactionDate = new Date(transaction.transactionDetails.transactionDate);
    const currentDate = new Date(currentTransactionDate);
    return (currentDate.getTime() - transactionDate.getTime()) < 30 * 24 * 60 * 60 * 1000;
  });
  const frequency = pastMonthTransactions.length;
  if (frequency > HIGH_FREQUENCY_THRESHOLD) return 1.0;
  return frequency / HIGH_FREQUENCY_THRESHOLD;
}

export function calculateGeographicalRisk(countryCode: string): number {
  return HIGH_RISK_LOCATIONS.includes(countryCode) ? 1.0 : 0.0;
}

export function calculatePastBehaviorRisk(transactionHistory: Transaction[], currentTransaction: Transaction): number {
  const similarTransactions = transactionHistory.filter(transaction => {
    return transaction.userId === currentTransaction.userId && transaction.transactionDetails.merchantDetails.category === currentTransaction.transactionDetails.merchantDetails.category;
  });
  const anomalyScore = similarTransactions.length / transactionHistory.length;
  return 1.0 - anomalyScore;
}

export function calculateAggregateRiskScore(transaction: Transaction): number {
  const amountRisk = calculateAmountRisk(transaction.transactionDetails.amount);
  const frequencyRisk = calculateFrequencyRisk(transactionHistory, transaction.transactionDetails.transactionDate);
  const geographicalRisk = calculateGeographicalRisk(transaction.transactionDetails.merchantDetails.countryCode);
  const pastBehaviorRisk = calculatePastBehaviorRisk(transactionHistory, transaction);

  const aggregateRiskScore = (
    RISK_WEIGHTS.amount * amountRisk +
    RISK_WEIGHTS.frequency * frequencyRisk +
    RISK_WEIGHTS.geographical * geographicalRisk +
    RISK_WEIGHTS.pastBehavior * pastBehaviorRisk
  );

  return aggregateRiskScore;
}
