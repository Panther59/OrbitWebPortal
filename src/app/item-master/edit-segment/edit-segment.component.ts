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
  displaySegments: ItemCodeSegment[] = [];
  itemMasterService?: ItemMasterService;
  dialogMessageService?: DialogMessageService;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    maxLength: ['', [Validators.required]],
    parentID: [null, [Validators.required]],
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
        this.displaySegments = this.segments.filter(x => !data.segment || x.id !== data.segment.id);
      }

      if (data.segment) {
        this.isEdit = true;
        this.segment = Object.assign({}, data.segment);
        this.originalSegment = data.segment;
      } else {
        this.segment = {};
      }
    }

    if (this.segments.length === 0) {
      this.form.removeControl('parentID');
    } else {
      this.showParentSegments = true;
    }

    if (this.segment) {
      if (!this.segment.sequence) {
        this.segment.sequence = this.segments.length + 1;
      }
      if (!this.isEdit && this.segments.length > 0) {
        this.segment.parentID = this.segments.lastOrDefault()?.id;
      }

      if (!this.segment.parentID) {
        this.segment.parentID = 0;
      }

      this.form.patchValue(this.segment);
    }
  }

  async saveData() {
    if (this.form.valid && this.segment) {
      const segs = [];
      this.isSubmitting = true;
      this.segment.maxLength = this.form.value.maxLength;
      this.segment.name = this.form.value.name;
      this.segment.parentID =
        this.showParentSegments && this.form.value.parentID !== 0
          ? this.form.value.parentID
          : undefined;
      if (
        (this.isEdit === true &&
          this.originalSegment &&
          this.originalSegment.parentID !== undefined &&
          this.originalSegment.parentID !== this.form.value.parentID) ||
        (this.isEdit === false &&
          this.segments.lastOrDefault()?.id &&
          this.form.value.parentID !== this.segments.lastOrDefault()!.id!)
      ) {
        const result = await this.dialogMessageService?.confirm(
          'Segment Saving',
          'You have change the order of segment, if you proceed with the change then any mapping related to current segment will be lost. Are you sure you want to proceed?'
        );
        if (!result) {
          this.isSubmitting = false;
          return;
        }
        // if (this.originalSegment && this.originalSegment.parentID) {
        //   this.segments.insertAt(this.originalSegment.parentID, this.segment);
        //   this.segments.splice(this.originalSegment.parentID, 1);
        // }
        const parentIndex = this.segments.findIndex(x => x.id === this.form.value.parentID);
        this.segments.insertAt(parentIndex + 1, this.segment);
        for (let i = 0; i < this.segments.length; i++) {
          this.segments[i].parentID = i - 1 < 0 ? undefined : this.segments[i - 1].id;
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
