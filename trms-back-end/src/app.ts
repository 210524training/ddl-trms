import dotenv from 'dotenv';
import expressSession from 'express-session';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import StatusCodes from 'http-status-codes';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import log from './log';
import baseRouter from './routes';
import {
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  NoUserFoundError,
  PasswordNotMatchesError,
  ResourceDoesNotExistError,
  ValidationError,
} from './errors';

import uploadRoute from './utils/upload';

dotenv.config({});

const app = express();
const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = StatusCodes;

app.use(cors({
  credentials: true,
  origin: [
    process.env.WEB_CLIENT_ORIGIN || 'http://localhost:3000',
  ],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'djDhudffndjhuDHJ',
  cookie: {},

  // https://stackoverflow.com/a/28839613
  resave: true,
  saveUninitialized: true,
}));

app.use(fileUpload());

app.post('/upload/:rid', uploadRoute);

app.use('/', baseRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NoUserFoundError) {
    log.error(err);
    res.status(BAD_REQUEST).json({
      error: err.message,
    });

    return;
  }

  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof PasswordNotMatchesError) {
    log.error(err);
    res.status(BAD_REQUEST).json({
      error: err.message,
    });
    return;
  }

  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AuthenticationError) {
    log.error(err);
    res.status(UNAUTHORIZED).json({
      error: err.message,
    });

    return;
  }

  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AuthorizationError) {
    log.error(err);
    res.status(UNAUTHORIZED).json({
      error: err.message,
    });

    return;
  }

  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError || err instanceof BadRequestError) {
    log.error(err);
    res.status(BAD_REQUEST).json({
      error: err.message,
    });

    return;
  }

  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ResourceDoesNotExistError) {
    log.error(err);
    res.status(NOT_FOUND).json({
      error: err.message,
    });

    return;
  }

  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // TODO: Refactor later that sends back more than just a 400
  // Because not all requests that fail are the fault of the client
  console.log('Our custom error handler');
  log.error(err);
  res.status(BAD_REQUEST).json({
    error: err.message,
  });

  next(err);
});

export default app;
