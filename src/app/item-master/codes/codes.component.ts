import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'app/_animations';
import {
  ItemCode,
  ItemCodeDetail,
  ItemCodeMapping,
  ItemCodeMappingDetail,
  ItemCodeSegmentDetail,
} from 'app/_models';
import { ItemMasterService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxiDataGridColumn } from 'devextreme-angular/ui/nested/base/data-grid-column-dxi';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss'],
  animations: [slideInOut],
})
export class CodesComponent implements OnInit {
  @ViewChild('mappingGrid') mappingDataGrid?: DxDataGridComponent;
  @ViewChild('codeGrid') codesDataGrid?: DxDataGridComponent;
  id?: number;
  loading = false;
  showUploadSection = false;
  selectedFile: File | null = null;
  @BlockUI() blockUI?: NgBlockUI;
  detail?: ItemCodeSegmentDetail;
  codes?: ItemCode[];
  constructor(
    private dialogMessageService: DialogMessageService,
    private itemMasterService: ItemMasterService,
    private route: ActivatedRoute,
    private router: Router
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
            this.showUploadSection = false;
            this.selectedFile = null;
            this.loadData();
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

  recordDeleted(e: any) {
    if (e && e.data) {
      const recs: Array<ItemCodeMapping> = [];
      recs.push(e.data);
      this.deleteMappings(recs);
      e.cancel = true;
    }
  }

  async deleteSelectedRows(e: any) {
    if (this.mappingDataGrid?.selectedRowKeys) {
      const result = await this.dialogMessageService.confirm(
        'Delete Mappings',
        'Are you sure you want to delete all the selected mappings?'
      );
      if (result) {
        this.deleteMappings(this.mappingDataGrid?.selectedRowKeys);
      }
    }
  }

  deleteMappings(mappings: Array<ItemCodeMapping>) {
    this.blockUI?.start('Deleting code mappings...');
    this.itemMasterService.deleteCodeMappings(mappings).subscribe(
      async result => {
        this.blockUI?.stop();
        this.loadData();
      },
      async err => {
        this.blockUI?.stop();
        await this.dialogMessageService.error('Delete Mappings', err);
      }
    );
  }
  codeRecordDeleted(e: any) {}
  deleteSelectedCodes(e: any) {}
  navigateToChild() {
    if (this.detail && this.detail?.childSegment) {
      this.router.navigate(['/item-master/codes', this.detail?.childSegment.id]);
    }
  }
  navigateToParent() {
    if (this.detail && this.detail?.parentSegment) {
      this.router.navigate(['/item-master/codes', this.detail?.parentSegment.id]);
    }
  }
}
