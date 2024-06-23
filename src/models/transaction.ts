export interface Transaction {
    transactionId: string;
    userId: string;
    transactionDetails: {
      amount: number;
      currency: string;
      transactionDate: string;
      paymentMethod: string;
      merchantDetails: {
        merchantId: string;
        name: string;
        category: string;
        countryCode: string;
      };
      amountUSD?: number; // Added during enrichment
    };
    userDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      billingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
    additionalInfo: {
      deviceIp: string;
      userAgent: string;
    };
  }
  