import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class MessageService {
  messages: string[] = [];

  constructor(private dialog: MatDialog) {}

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
