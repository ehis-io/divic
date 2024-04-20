import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

const AppLogger = new Logger();

@Catch(HttpException)
export class ErrorResponse implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response: any = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status: any = exception.getStatus();

    console.log('message: ', exception.getResponse());

    AppLogger.error(
      `(LOGS) Error - ${
        response.message
      } statusCode : ${exception.getStatus()}`,
    );

    if (response?.status) {
      if (Array.isArray(exception.message)) {
        return response.status(status).json({
          status: 'error',
          message: 'Bad input data',
          error: exception.message,
        });
      }

      return response.status(status).json({
        status: 'error',
        message: exception.message,
        error: (exception.getResponse() as any)?.error,
      });
    }

    return exception;
  }
}
