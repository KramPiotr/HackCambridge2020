import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { WebsocketService } from "./websocket.service";
import { map } from 'rxjs/operators';

const CHAT_URL = "ws://172.20.3.69:3000/map";

export interface Message {
  type: string;
  leftCorner: Number[],
  rightCorner: Number[]
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketChatService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).pipe(map(
      (response: MessageEvent): Message => {
        let data = response.data;
        return {
          type: data.type,
          leftCorner: data.leftCorner,
          rightCorner: data.rightCorner
        };
      }
    )
    );
  }
}
