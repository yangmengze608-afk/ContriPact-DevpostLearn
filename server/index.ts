import express from 'express';
import analysisRouter from './routes/analysis';

const app = express();
const port = Number(process.env.API_PORT ?? 8787);
app.use(express.json({ limit: '128kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'contripact-api' }));
app.use('/api/analyze', analysisRouter);
app.listen(port, '127.0.0.1', () => console.log(`ContriPact API listening on http://127.0.0.1:${port}`));
