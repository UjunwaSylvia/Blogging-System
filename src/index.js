import express from 'express';
import { configDotenv } from 'dotenv';
import { connectDB } from './config/db.config.js';
import globalError from './errors/global.error.js';
import CustomError from './errors/custom.error.js';
import router from './routes/index.js';

configDotenv();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World from Vercel!');
});

app.use('/api/v1', router);

app.use((req, res, next) => {
  next(new CustomError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalError);

// ✅ Only listen locally
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8000;
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

// ✅ Export for Vercel (serverless)
export default app;