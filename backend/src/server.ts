import express from 'express';
import cors from 'cors';
import charactersRouter from './routes/characters';
import historyRouter from './routes/history'; // <--- 1. ייבוא הקובץ החדש

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// חיבור הנתיבים
app.use('/api/characters', charactersRouter);
app.use('/api/search-history', historyRouter); // <--- 2. חיבור הנתיב החדש

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});