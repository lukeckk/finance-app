import { createClient } from "@/lib/supabase/server"
import TransactionItem from "./transaction"
import TransactionSummaryItem from "./transaction-summary"

const groupAndSumTransactionsByDate = (transactions) => {
  const grouped = {}
  for (const transaction of transactions) {
    const date = transaction.created_at.split('T')[0]
    if (!grouped[date]) {
      // creates a 'date' key which has values of 'transations' and 'amount' as nested keys
      grouped[date] = { transactions: [], amount: 0 }
    }
    grouped[date].transactions.push(transaction)
    // if transaction type is 'expense', amount = amount - transation.amount, else amount = transaction.amount
    const amount = transaction.type === 'Expense' ? -transaction.amount : transaction.amount
    // add the amount for non-expense
    grouped[date].amount += amount
  }
  return grouped
}

export default async function TransactionList() {
  const supabase = await createClient()
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
  const grouped = groupAndSumTransactionsByDate(transactions)

  return (
    <div className="space-y-8">
      {Object.entries(grouped)
        .map(([date, { transactions, amount }]) =>
          <div key={date}>
            <TransactionSummaryItem date={date} amount={amount} />
            <hr className="my-4 border-gray-200 dark:border-gray-800" />
            <section className="space-y-4">
              {transactions.map(transaction => <div key={transaction.id}>
                <TransactionItem {...transaction} />
              </div>)}
            </section>
          </div>
        )}
    </div>
  )
}