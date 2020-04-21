import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    // const b: Balance = this.transactions.reduce(
    //   (accumulator: Balance, current: Transaction) => {
    //     if (current.type === 'income') {
    //       accumulator.income += current.value;
    //     } else {
    //       accumulator.outcome += current.value;
    //     }

    //     accumulator.total = accumulator.income - accumulator.outcome;
    //     return { ...accumulator };
    //   },
    //   { income: 0, outcome: 0, total: 0 },
    // );

    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance.income += transaction.value;
      } else {
        balance.outcome += transaction.value;
      }
    });

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const balance: Balance = this.getBalance();
      const diff = balance.total - value;
      if (diff < 0) {
        throw Error("You don't have enough money");
      }
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
