import { useEffect, useMemo, useState } from 'react'
import { AppBar, Box, Button, Container, CssBaseline, Grid, Paper, TextField, Toolbar, Typography } from '@mui/material'
import { Line } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Transaction, createTransaction, fetchInsights } from './api'
import TransactionList from './components/TransactionList'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chartColors = ['#1976d2', '#9c27b0', '#ef6c00']

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [insights, setInsights] = useState<any>(null)

  const chartData = useMemo(() => {
    return {
      labels: transactions.map((t) => new Date(t.occurred_at).toLocaleDateString('ru-RU')),
      datasets: [
        {
          label: 'Расходы',
          data: transactions.map((t) => t.amount),
          borderColor: chartColors[0],
          backgroundColor: chartColors[0],
        },
      ],
    }
  }, [transactions])

  useEffect(() => {
    // В реальном приложении сюда добавляется загрузка JWT и запросы к REST API.
    fetchInsights()
      .then(setInsights)
      .catch(() => setInsights(null))
  }, [])

  const handleAdd = async () => {
    const numericAmount = parseFloat(amount)
    if (Number.isNaN(numericAmount)) return
    const created = await createTransaction({ amount: numericAmount, note, occurred_at: new Date().toISOString() })
    setTransactions((prev) => [...prev, created])
    setAmount('')
    setNote('')
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Личные финансы — React + TypeScript + Material-UI + Chart.js
          </Typography>
          <Button color="inherit" href="#">Войти (JWT)</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Новая транзакция
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Сумма"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  fullWidth
                />
                <TextField label="Комментарий" value={note} onChange={(e) => setNote(e.target.value)} fullWidth />
                <Button variant="contained" onClick={handleAdd} disabled={!amount}>
                  Добавить
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Динамика расходов
              </Typography>
              <Line data={chartData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <TransactionList transactions={transactions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Инсайты поведения (REST API)
              </Typography>
              {insights ? (
                <>
                  <Typography>Всего расходов: {insights.total_spent} ₽</Typography>
                  <Typography>Прогноз на следующий месяц: {insights.forecast_next_month} ₽</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Данные получены через FastAPI + JWT.
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">Загрузите инсайты после входа</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
