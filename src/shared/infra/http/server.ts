// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';
import 'dotenv/config';

import express, { json, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate'

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());

app.use(json());

app.use('/files', express.static(uploadConfig.uploadDirectory));

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err.message);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
