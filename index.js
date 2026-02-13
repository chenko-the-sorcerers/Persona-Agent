// ============================================================
// ARUTALA PERSONA AGENT — SERVER ENTRY POINT
// ============================================================
require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const cookieParser = require('cookie-parser');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const path        = require('path');

// Routes
const authRoutes  = require('./server/routes/auth');

// DB init (runs schema on startup)
const { getDb } = require('./server/config/database');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Security ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,  // Disable CSP for development
}));

// ─── CORS ─────────────────────────────────────────────────────
// Improved CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(null, true); // Allow in development - change to false in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ─── Body / Cookie ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak permintaan. Coba lagi nanti.' },
});
app.use('/api/', limiter);

// ─── Static Files (serve client) ──────────────────────────────
app.use(express.static(path.join(__dirname, 'client/public')));

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Arutala API is running 🚀', timestamp: new Date().toISOString() });
});

// ─── Serve HTML files ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

app.get('/chatbot.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/chatbot.html'));
});

// ─── 404 ──────────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// ─── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────
// Initialize DB first, then start server
getDb();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Arutala API running at http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Allowed Origins: ${allowedOrigins.join(', ')}\n`);
});