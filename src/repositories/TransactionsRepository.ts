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
    let income = 0;
    let outcome = 0;
    let total = 0;

    this.transactions.forEach(item => {
      if (item.type === 'income') {
        income += item.value;
      } else {
        outcome += item.value;
      }
    });

    total = income - outcome;
    const balance: Balance = { income, outcome, total };
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
