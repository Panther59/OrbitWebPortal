import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, MessageDialog } from '..';
import { getMessage } from 'app/global';

@Injectable()
export class DialogMessageService {
  constructor(private dialog: MatDialog) {}

  async success(title: string, message: string, buttonText?: string): Promise<void> {
    const msgRef = this.dialog.open(MessageDialog, {
      data: { isError: false },
      disableClose: true,
      hasBackdrop: true,
    });
    msgRef.componentInstance.title = title;
    msgRef.componentInstance.message = message;
    if (buttonText != null) {
      msgRef.componentInstance.buttonText = buttonText;
    }
    return await msgRef.afterClosed().toPromise();
  }
  async error(title: string, error: any, buttonText?: string): Promise<void> {
    const msgRef = this.dialog.open(MessageDialog, {
      data: { isError: true },
      disableClose: true,
      hasBackdrop: true,
    });
    msgRef.componentInstance.title = title;
    msgRef.componentInstance.message = getMessage(error);
    if (buttonText != null) {
      msgRef.componentInstance.buttonText = buttonText;
    }
    return await msgRef.afterClosed().toPromise();
  }

  async showMessage(title: string, message: string, buttonText?: string): Promise<void> {
    const msgRef = this.dialog.open(MessageDialog, {
      data: {},
      disableClose: true,
      hasBackdrop: true,
    });
    msgRef.componentInstance.title = title;
    msgRef.componentInstance.message = message;
    if (buttonText != null) {
      msgRef.componentInstance.buttonText = buttonText;
    }
    return await msgRef.afterClosed().toPromise();
  }

  async confirm(title: string, message: string): Promise<boolean> {
    const msgRef = this.dialog.open(ConfirmDialog, {
      data: {},
      disableClose: true,
      hasBackdrop: true,
    });
    msgRef.componentInstance.title = title;
    msgRef.componentInstance.message = message;
    return await msgRef.afterClosed().toPromise();
  }
}
