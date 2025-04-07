import TransactionList from "@/components/transaction-list"
import { Suspense } from "react"
import TransactionListFallback from "@/components/transaction-list-fallback"
import TrendFetch from "@/components/trend-fetch"
import TrendFallback from "@/components/trend-fallback"
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { sizes, variants } from "@/lib/variants"
import { createClient } from "@/lib/supabase/server"

export default async function Dashboard() {
  const client = await createClient()

  return (
    <>
      <section className="mb-8">
        <h1 className="text-4xl font-semibold">Summary</h1>
      </section>

      <section className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
        <Suspense fallback={<TrendFallback />}>
          <TrendFetch type="Income" />
        </Suspense>
        <Suspense fallback={<TrendFallback />}>
          <TrendFetch type="Expense" />
        </Suspense>
        <Suspense fallback={<TrendFallback />}>
          <TrendFetch type="Saving" />
        </Suspense>
        <Suspense fallback={<TrendFallback />}>
          <TrendFetch type="Investment" />
        </Suspense>
      </section>

      <section className="flex justify-between items-center mb-8">
        <h2 className="text-2xl">Transactions</h2>
        <Link href="/dashboard/transaction/add" className={`flex items-center space-x-1 ${variants['outline']} ${sizes['sm']}`}>
          <PlusCircle className="w-4 h-4" />
          <div>Add</div>
        </Link>
      </section>

      <Suspense fallback={<TransactionListFallback />}>
        <TransactionList />
      </Suspense>
    </>
  )
}