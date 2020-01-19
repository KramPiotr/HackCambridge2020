import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { ServerSocketComponent } from './server-socket/server-socket.component';
import { WebsocketService } from './websocket.service';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    
    // ServerSocketComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [WebsocketService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class AppModule { }
