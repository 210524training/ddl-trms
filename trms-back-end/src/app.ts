import multer from 'multer';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import StatusCodes from 'http-status-codes';
import cors from 'cors';
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

import reimbursementService from './services/reimbursement.service';
import {
  upload as uploadFile, download as downloadFile, unLinkFileLocally, unlinkFileInS3,
} from './dynamo/s3';

import { Attachment } from './@types/trms/index.d';
import userService from './services/user.service';

dotenv.config({});

const app = express();
const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = StatusCodes;

app.use(cors({
  credentials: true,
  origin: [
    process.env.WEB_CLIENT_ORIGIN || '',
    'http://localhost:5000',
    'http://localhost:3000',
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

const upload = multer({ dest: 'uploads/' });

const uploadRoute = async (req: Request<{ rid: string }>, res: Response) => {
  const { file, params: { rid }, session: { user } } = req;

  console.log(rid, file);
  if (!file || !rid || !user) {
    log.debug(!file, !rid, !user);
    return res.status(400).json({
      message: `Missing file ${!file}; Missing reimbursement id ${!rid}; logged in ${!user}`,
    });
  }

  const reimbursement = await reimbursementService.getById(rid);

  if (!reimbursement) {
    throw new ResourceDoesNotExistError('Could not find reimbursement');
  }

  log.debug(reimbursement.employeeId, user.id);
  if (reimbursement.employeeId !== user.id) {
    throw new AuthorizationError('You are not authroized to upload files on behalf of this user.');
  }

  const result = await uploadFile(file);
  await unLinkFileLocally(file.path);
  log.debug(result);

  if (result.Key) {
    const attachment: Attachment = {
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      key: result.Key,
    };
    reimbursement.attachments.push(attachment);
    if (await reimbursementService.update(reimbursement)) {
      return res.status(200).json({
        ...attachment,
        path: `/files/${rid}/${result.Key}`,
      });
    }
    return res.status(500).json({ message: 'Failed to update reimbursement with the new file' });
  }

  return res.status(500).json({ message: 'Failed to uplaod file' });
};

const getFile = async (req: Request<{ rid: string, key: string }>, res: Response) => {
  const { params: { rid, key }, session: { user } } = req;

  if (!rid) {
    throw new BadRequestError('Missing reimbursement id in params /files/:rid/:key');
  }

  if (!key) {
    throw new BadRequestError('Missing key (file key) in params /files/:rid/:key');
  }

  if (!user) {
    throw new AuthenticationError('Not logged in');
  }
  const ru = await userService.getById(user.id);
  const reimbursement = await reimbursementService.getById(rid);
  if (ru && reimbursement && reimbursement.attachments.map((a) => a.key).includes(key)) {
    if (reimbursement.employeeId === user.id || ru.isSuperUser()) {
      const stream = downloadFile(key);
      return stream.pipe(res);
    }
    throw new AuthorizationError('You are not authorized to view files from another user.');
  }

  throw new BadRequestError('Missing information, file not property of reimbursement, or reimbursement does not exist');
};

const deleteFile = async (req: Request<{ rid: string, key: string }>, res: Response) => {
  log.debug('Reached delete file route');
  const { params: { rid, key }, session: { user } } = req;

  if (!rid) {
    throw new BadRequestError('Missing reimbursement id in params /files/:rid/:key');
  }

  if (!key) {
    throw new BadRequestError('Missing key (file key) in params /files/:rid/:key');
  }

  if (!user) {
    throw new AuthenticationError('Not logged in');
  }
  const ru = await userService.getById(user.id);
  const reimbursement = await reimbursementService.getById(rid);
  log.debug('>>', reimbursement);
  log.debug('>> incluides >>? ?', reimbursement ? reimbursement.attachments.map((a) => a.key).includes(key) : '');
  if (ru && reimbursement && reimbursement.attachments.map((a) => a.key).includes(key)) {
    log.debug('-====-==-');
    if (reimbursement.employeeId === user.id || ru.isSuperUser()) {
      log.debug('deleting files route');
      const result = await unlinkFileInS3(key);
      log.debug(result);
      return res.status(200);
    }
    throw new AuthorizationError('You are not authorized to delete files from another user.');
  }

  throw new BadRequestError('Missing information, file not property of reimbursement, or reimbursement does not exist');
};

app.post('/upload/:rid', upload.single('file'), uploadRoute);
app.get('/files/:rid/:key', getFile);
app.delete('/files/:rid/:key', deleteFile);

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
  console.log('Our custom error handler');
  log.error(err);
  res.status(BAD_REQUEST).json({
    error: err.message,
  });

  next(err);
});

export default app;
