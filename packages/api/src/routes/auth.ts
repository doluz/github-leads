import { Router, type Router as ExpressRouter } from 'express';
import passport from '../passport.js';

const router: ExpressRouter = Router();

// Redirect to GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'read:user'] }));

// GitHub OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=auth_failed' }),
  (_req, res) => {
    res.redirect(process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/dashboard` : '/dashboard');
  }
);

// Current user
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'not_authenticated' });
  }
  res.json(req.user);
});

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
});

export default router;
