import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gitleads-api', ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`);
});
