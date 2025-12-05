export type Transaction = {
  id: number
  amount: number
  note?: string
  occurred_at: string
  category_id?: number | null
  owner_id?: number
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function createTransaction(input: Partial<Transaction>): Promise<Transaction> {
  // В демо режимах шлем запрос в моковый эндпоинт инсайтов, где нет проверки JWT.
  const resp = await fetch(`${BASE_URL}/api/transactions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
    body: JSON.stringify(input),
  })
  if (!resp.ok) {
    // Даем возможность фронту работать без живого бэкенда.
    return {
      id: Date.now(),
      amount: input.amount || 0,
      note: input.note,
      occurred_at: input.occurred_at || new Date().toISOString(),
      category_id: input.category_id ?? null,
    }
  }
  return resp.json()
}

export async function fetchInsights(): Promise<any> {
  const resp = await fetch(`${BASE_URL}/api/transactions/insights/sample`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
  })
  if (!resp.ok) {
    return {
      total_spent: 0,
      forecast_next_month: 0,
    }
  }
  return resp.json()
}
