import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const ignoreStatuses = [401, 403];

@Catch()
export class LoggingFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let eventId: string;
    if (!ignoreStatuses.includes(status)) {
      // const id = (request.user as User)?.id;
      // const username = id?.toString();
      // eventId = captureException(exception, {
      //   user: username ? { username } : undefined,
      // });

      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      eventId: eventId || undefined,
    });
  }
}
