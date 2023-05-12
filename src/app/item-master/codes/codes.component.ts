import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemCodeSegmentDetail } from 'app/_models';
import { ItemMasterService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss'],
})
export class CodesComponent implements OnInit {
  id?: number;
  loading = false;
  selectedFile: File | null = null;
  @BlockUI() blockUI?: NgBlockUI;
  detail?: ItemCodeSegmentDetail;

  constructor(
    private dialogMessageService: DialogMessageService,
    private itemMasterService: ItemMasterService,
    private route: ActivatedRoute
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  upload() {
    if (this.selectedFile !== null) {
      const formData = new FormData();

      formData.append(this.selectedFile.name, this.selectedFile);

      this.blockUI?.start('Uploading mapping files...');
      this.itemMasterService.upload(this.id!, formData).subscribe(
        async results => {
          this.blockUI?.stop();
          if (!results || results.length === 0) {
            await this.dialogMessageService.showMessage(
              'Upload Mapping',
              'Mapping records uploaded successfully without errors'
            );
            this.selectedFile = null;
          } else {
            const message = results.join('\r\n');
            await this.dialogMessageService.error(
              'Upload Mapping',
              `Following warnings are present while uploading excel, please correct the same and try again\r\n\r\n${message}`
            );
          }
        },
        async err => {
          this.blockUI?.stop();
          await this.dialogMessageService.error('Upload Mapping', err);
        }
      );
    }
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params.id; // (+) converts string 'id' to a number
      this.loadData();
      // In a real app: dispatch action to load the details here.
    });
  }
  loadData() {
    this.loading = true;
    this.itemMasterService.getSegmentDetail(this.id!).subscribe(
      async result => {
        this.detail = result;
        this.loading = false;
      },
      async err => {
        this.loading = false;
        await this.dialogMessageService.error('Segment Detail', err);
      }
    );
  }
}
