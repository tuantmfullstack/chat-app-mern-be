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

const app = express();
// app.use(function (req, res, next) {
//   const allowedOrigins = [
//     'http://localhost:5173',
//     'http://127.0.0.1:5173',
//     'https://statuesque-truffle-30853b.netlify.app/',
//   ];
//   const origin = req.headers.origin;
//   console.log({ headers: req.headers });
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   // res.setHeader('Access-Control-Allow-Headers', '*');
//   res.setHeader('Access-Control-Allow-credentials', true);
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, DELETE, UPDATE'
//   );
//   res.setHeader('')
//   next();
// });

app.use((req, res, next) => {
  console.log(req);
  next();
});

const corOptions = {
  // origin: [
  //   'http://localhost:5173/*',
  //   'http://127.0.0.1:5173/*',
  //   'https://statuesque-truffle-30853b.netlify.app/*',
  // ],
  origin: '*',
  // methods: 'GET, POST, PUT, DELETE, UPDATE',
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true,
  // preflightContinue: false,
};

app.use(cors(corOptions));

dotenv.config({ path: path.join(path.resolve(), '/.env') });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(urlencoded({ extended: false }));

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
