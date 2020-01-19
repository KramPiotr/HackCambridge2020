import { TestBed } from '@angular/core/testing';

import { WebSocketChatService } from './web-socket-chat.service';

describe('WebSocketChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketChatService = TestBed.get(WebSocketChatService);
    expect(service).toBeTruthy();
  });
});
