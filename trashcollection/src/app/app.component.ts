import { Component, AfterViewInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { WebSocketChatService } from "./web-socket-chat.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }

  constructor(private chatService: WebSocketChatService) {
    console.log("constructing app");
    chatService.messages.subscribe(msg => {
      console.log(msg)
       // binRes = JSON.parse(msg.toString().split("|")[0]);
      }
    )
  }

  private message = {
    type: "getData",
    kind: "bin",
    leftCorner: [-5,-5],
    rightCorner: [60,60]
  };


  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.chatService.messages.next(this.message);
  }
}
