
import * as SockJS from 'sockjs-client';
import { over, Client } from 'stompjs';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

export enum SocketClientState {
    ATTEMPTING, CONNECTED
  }

export const environment = {
    production: false,
    api: '172.20.3.69:3000/map'
};
export class connectSocket implements OnDestroy, OnInit {
    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
    ngOnInit() {
        //this.connect();
      }



  @Injectable({
    providedIn: 'root'
  })
    private client: Client;
    private state: BehaviorSubject<SocketClientState>;
  
    constructor() {
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