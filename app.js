import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import errorController from './controllers/errorController.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import messageRoute from './routes/messageRoute.js';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

const app = express();

const corOptions = {
  origin: '*',
};

app.use(cors(corOptions));

dotenv.config({ path: path.join(path.resolve(), '/.env') });
console.log(`Env: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP. Please try again in an hour!',
});
app.use(limiter);
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/conversations', conversationRoute);
app.use('/api/v1/messages', messageRoute);

app.use('*', (req, res) => {
  res.status(400).json({
    status: 'fail',
    message: 'Page not found!',
  });
});

app.use(errorController);

export default app;
