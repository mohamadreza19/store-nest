import { NotFound } from '@aws-sdk/client-s3';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Catch,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongoError, MongoServerError } from 'mongodb';
import { Error as MongoseError } from 'mongoose';
const { CastError } = MongoseError;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('some_name');

  catch(exception, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: number = null;
    let message: string | object = 'Internal server error';
    let addetinal = null;

    console.log(exception);
    if (exception instanceof HttpException) {
      const responseErr = exception.getResponse() as {
        message: string | object;
      };

      // if
      console.log(JSON.stringify(exception));
      console.log('is');
      statusCode = exception.getStatus();
      message = responseErr.message;
    } else if ((exception as any).name == MongoServerError.name) {
      const error = exception as MongoServerError;
      statusCode = HttpStatus.CONFLICT;

      switch (error.code) {
        case 11000:
          message = `The value already exists. Please choose a different`;
          code = error.code;
          addetinal = error.keyValue;

          break;

        default:
          console.log(exception);
          break;
      }
    } else if (exception instanceof CastError) {
      statusCode = HttpStatus.BAD_REQUEST;

      message = `The format of ${exception.stringValue} has a problem`;
    } else if (exception instanceof JsonWebTokenError) {
      message = exception.message;
      statusCode = HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof NotFound) {
      statusCode = HttpStatus.NOT_FOUND;
      message = null;
    }

    response.status(statusCode).json({
      code: code,
      error: message,
      addetinal: addetinal,
      // error_trace: exception.stack,
    });
  }
}
