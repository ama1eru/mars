import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Transaction } from '../api'

type Props = {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: Props) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Последние операции
      </Typography>
      <List>
        {transactions.map((t) => (
          <ListItem key={t.id} divider>
            <ListItemText
              primary={`${t.amount.toFixed(2)} ₽`}
              secondary={`${new Date(t.occurred_at).toLocaleString('ru-RU')} · ${t.note || 'без комментария'}`}
            />
          </ListItem>
        ))}
        {transactions.length === 0 && (
          <ListItem>
            <ListItemText primary="Добавьте первую транзакцию" />
          </ListItem>
        )}
      </List>
    </Paper>
  )
}
