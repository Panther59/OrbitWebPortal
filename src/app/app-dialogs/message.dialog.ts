import { Component, Injectable, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  moduleId: module.id,
  styleUrls: ['message.dialog.scss'],
  templateUrl: 'message.dialog.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MessageDialog implements OnInit {
  @Input() title = '';
  @Input() message = '';
  @Input() buttonText = 'Close';
  isError!: boolean;
  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isError) {
      this.isError = data.isError;
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
