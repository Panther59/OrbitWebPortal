import { Component, Injectable, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    moduleId: module.id,
    styleUrls: ['confirm.dialog.scss'],
    templateUrl: 'confirm.dialog.html'
})

export class ConfirmDialog implements OnInit {

    @Input() title = '';
    @Input() message = '';
    constructor(public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }
    yes() {
        this.dialogRef.close(true);
    }

    no() {
        this.dialogRef.close(false);
    }

    ngOnInit() {
    }
}
