import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';


type Response = {
  number: string;
  username: string;
  isCustomer: boolean;
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;


  async incomingCall(data: Response) {
    this.server.emit('incomingCall', data);
  }

  // setInterval(() => {
  //   //   response.data = Math.random();
  //   //   this.server.emit('events', response);
  //   // }, 5000);

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   //return number
  //   // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));


  //   const response: WsResponse<number> = {
  //     event: 'events', // The event to send back to the client
  //     data: 42, // Replace with your actual data
  //   };
  //   // //response change every 5 seconds
  //   // setInterval(() => {
  //   //   response.data = Math.random();
  //   //   this.server.emit('events', response);
  //   // }, 5000);

  //   // You can return an observable of the response.
  //   return new Observable<WsResponse<number>>((observer) => {
  //     observer.next(response);
  //     observer.complete();
  //   });
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }
}
