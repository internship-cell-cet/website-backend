import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';

import { v2 } from 'cloudinary';
import useRoutes from './routes/index.js';
import passport from './config/passport.js';
import { defaultErrorHandler } from './utils/error-handlers.js';

const app = express();
dotenv.config();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({ credentials: true, origin: `${process.env.ORIGIN}` }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(
  session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 3600000,
      sameSite: 'None',
      secure: true
     },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

useRoutes(app);

app.get('/', (req, res) => {
  res.send('Hello to Job Portal API');
});

app.use(defaultErrorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))) // eslint-disable-line no-console
  .catch((error) => console.log(error.message)); // eslint-disable-line no-console

mongoose.set('useFindAndModify', false);
