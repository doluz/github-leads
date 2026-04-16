import express, { type Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';

import passport from './passport.js';
import authRouter from './routes/auth.js';
import scraperRouter from './routes/scraper.js';
import billingRouter from './routes/billing.js';

const app: Express = express();
const PORT = process.env.PORT ?? 3001;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

// Stripe webhook requires raw body — mount before express.json()
app.use(
  '/api/billing/webhook',
  express.raw({ type: 'application/json' })
);

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-secret-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gitleads-api', ts: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/scraper', scraperRouter);
app.use('/api/billing', billingRouter);

app.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`);
});

export default app;
