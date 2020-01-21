import * as SockJS from 'sockjs-client';
import { over, Client } from 'stompjs';
import { Injectable, OnDestroy, OnInit, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { print } from 'util';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}

export const environment = {
  production: false,
  api: 'ws://172.20.3.69:3000/map'
}

@Component({
  selector: 'app-server-socket',
  templateUrl: './server-socket.component.html',
  styleUrls: ['./server-socket.component.css']
})

export class ServerSocketComponent implements OnInit, OnDestroy {


    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
    ngOnInit() {
        this.send("test", "");
        this.send("test", "hihi");
        this.send("test", "haha");
        this.send("test", "it works!");
      }

  @Injectable({
    providedIn: 'root'
  })
    private client: Client;
    private state: BehaviorSubject<SocketClientState>;
  
    constructor() {
      print("constructing");
      this.client = over(new SockJS(environment.api));
      this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
      this.client.connect({}, () => {
        this.state.next(SocketClientState.CONNECTED);
      });
    }
  
    private connect(): Observable<Client> {
      return new Observable<Client>(observer => {
        this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
          observer.next(this.client);
        });
      });
    }

    send(topic: string, payload: any): void {
        this.connect()
          .pipe(first())
          .subscribe(client => client.send(topic, {}, JSON.stringify(payload)));
      }  
}


