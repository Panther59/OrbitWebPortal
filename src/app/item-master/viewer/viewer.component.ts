import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemCodeSegment } from 'app/_models';
import { EditSegmentComponent } from '../edit-segment/edit-segment.component';
import { ItemMasterService } from 'app/_services/apis/itemMaster.service';
import { DialogMessageService } from 'app/app-dialogs';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  loading = false;
  segments: ItemCodeSegment[] = [];
  isSubmitting = false;

  constructor(
    private dialogMessageService: DialogMessageService,
    private itemMasterService: ItemMasterService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadData();
  }
  addNewSegment(segment?: ItemCodeSegment) {
    const dialogRef = this.dialog.open(EditSegmentComponent, {
      data: {
        itemMasterService: this.itemMasterService,
        dialogMessageService: this.dialogMessageService,
        segments: this.segments,
        segment,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading = true;
    this.itemMasterService.getAll().subscribe(
      segments => {
        this.segments = segments;
        this.loading = false;
      },
      async error => {
        this.loading = false;
        await this.dialogMessageService.error('Item Master', error);
      }
    );
  }

  editSegment(segment: ItemCodeSegment) {
    this.addNewSegment(segment);
  }

  async deleteSegment(segment: ItemCodeSegment) {
    const result = await this.dialogMessageService?.confirm(
      'Segment Delete',
      'Deleting segment may affect the order of segment, if you proceed with the change then any mapping related to current segment will be lost. Are you sure you want to proceed?'
    );
    if (!result) {
      return;
    }
    this.isSubmitting = true;

    this.itemMasterService?.delete(segment).subscribe(
      x => {
        this.isSubmitting = false;
        this.loadData();
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
