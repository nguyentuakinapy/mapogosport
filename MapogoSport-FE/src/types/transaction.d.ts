interface Transaction {
    transactionId: number;
    amount: number;
    transactionType: string;
    description: string;
    createdAt: Date
}