import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const data = host.switchToWs().getData();

    // Log the exception and client info
    console.error('Exception caught:', exception);
    console.log('Client ID:', client.id);
    console.log('Client Data:', data);

    let error;
    if (exception instanceof WsException) {
      error = exception.getError();
    } else if (exception instanceof HttpException) {
      error = exception.getResponse();
    } else {
      error = { message: 'Unknown error occurred' };
    }

    const details = typeof error === 'object' ? { ...error } : { message: error };

    // Emit the error event
    try {
      client.emit(
        'error',
        JSON.stringify({
          id: client.id,
          rid: data.rid,
          ...details,
        }),
      );
    } catch (emitError) {
      console.error('Error emitting to client:', emitError);
    }

    // Safely disconnect the client
    try {
      client.disconnect(true);
    } catch (disconnectError) {
      console.error('Error disconnecting client:', disconnectError);
    }
  }
}