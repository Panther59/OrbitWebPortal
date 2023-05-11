import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemCodeSegment } from 'app/_models';
import { ItemMasterService } from 'app/_services/apis/itemMaster.service';
import { DialogMessageService } from 'app/app-dialogs';

@Component({
  templateUrl: './edit-segment.component.html',
  styleUrls: ['./edit-segment.component.scss'],
})
export class EditSegmentComponent {
  isEdit = false;
  isSubmitting = false;
  showParentSegments = false;
  segment?: ItemCodeSegment;
  originalSegment?: ItemCodeSegment;
  segments: ItemCodeSegment[] = [];
  itemMasterService?: ItemMasterService;
  dialogMessageService?: DialogMessageService;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    maxLength: ['', [Validators.required]],
    perentSegment: [null, [Validators.required]],
  });
  constructor(
    private _ngZone: NgZone,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditSegmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      if (data && data.itemMasterService) {
        this.itemMasterService = data.itemMasterService;
      }

      if (data && data.dialogMessageService) {
        this.dialogMessageService = data.dialogMessageService;
      }

      if (data.segments) {
        this.segments = data.segments;
      }

      if (data.segment) {
        this.isEdit = true;
        this.segments = this.segments.filter(x => x.id !== data.segment.id);
        this.segment = Object.assign({}, data.segment);
        this.originalSegment = data.segment;
        this.originalSegment!.perentSegment = data.segment.sequence - 1;
      } else {
        this.segment = {};
      }
    }

    if (this.segments.length === 0) {
      this.form.removeControl('perentSegment');
    } else {
      this.showParentSegments = true;
    }

    if (this.segment) {
      if (!this.segment.sequence) {
        this.segment.sequence = this.segments.length + 1;
      }
      this.segment.perentSegment = this.isEdit ? this.segment.sequence! - 1 : this.segments.length;

      this.form.patchValue(this.segment);
    }
  }

  async saveData() {
    if (this.form.valid && this.segment) {
      const segs = [];
      this.isSubmitting = true;
      this.segment.maxLength = this.form.value.maxLength;
      this.segment.name = this.form.value.name;
      this.segment.sequence = this.showParentSegments ? this.form.value.perentSegment + 1 : 1;
      if (
        (this.isEdit === true &&
          this.originalSegment &&
          this.originalSegment.perentSegment !== undefined &&
          this.originalSegment.perentSegment !== this.form.value.perentSegment) ||
        (this.isEdit === false && this.form.value.perentSegment < this.segments.length)
      ) {
        const result = await this.dialogMessageService?.confirm(
          'Segment Saving',
          'You have change the order of segment, if you proceed with the change then any mapping related to current segment will be lost. Are you sure you want to proceed?'
        );
        if (!result) {
          this.isSubmitting = false;
          return;
        }
        if (this.originalSegment && this.originalSegment.perentSegment) {
          this.segments.insertAt(this.originalSegment.perentSegment, this.segment);
          this.segments.splice(this.originalSegment.perentSegment, 1);
        }
        this.segments.insertAt(this.form.value.perentSegment, this.segment);
        for (let i = 0; i < this.segments.length; i++) {
          this.segments[i].perentSegment = i;
          this.segments[i].sequence = i + 1;
        }
        segs.push(...this.segments);
      } else {
        segs.push(this.segment);
      }

      this.itemMasterService?.save(segs).subscribe(
        x => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        err => {
          this.isSubmitting = false;
          if (this.dialogMessageService) {
            this.dialogMessageService.error('Save Segment', err);
          } else {
            console.error(err);
          }
        }
      );
    }
  }

  cancelSaving() {
    this.dialogRef.close(false);
  }
}
