import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from 'app/_animations';
import {
  ItemCode,
  ItemCodeDetail,
  ItemCodeMapping,
  ItemCodeMappingDetail,
  ItemCodeSegmentDetail,
} from 'app/_models';
import { ItemCodesService, ItemMasterService } from 'app/_services';
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
export class CodesComponent implements OnInit, AfterViewInit {
  @ViewChildren(DxDataGridComponent) grids?: QueryList<DxDataGridComponent>;
  mappingDataGrid?: DxDataGridComponent;
  codesDataGrid?: DxDataGridComponent;

  loading = false;
  showUploadSection = false;
  selectedFile: File | null = null;
  @BlockUI() blockUI?: NgBlockUI;
  detail?: ItemCodeSegmentDetail;
  codes?: ItemCode[];
  showChildMapping = false;
  constructor(
    private dialogMessageService: DialogMessageService,
    private itemMasterService: ItemMasterService,
    private itemCodesService: ItemCodesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    this.grids?.changes.subscribe(x => {
      if (x.length > 1) {
        this.codesDataGrid = x.get(0);
        this.mappingDataGrid = x.get(1);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  upload() {
    if (this.selectedFile !== null && this.detail) {
      const formData = new FormData();

      formData.append(this.selectedFile.name, this.selectedFile);

      this.blockUI?.start('Uploading mapping files...');
      this.itemCodesService.upload(this.detail.id!, formData).subscribe(
        async results => {
          this.blockUI?.stop();
          if (!results || results.length === 0) {
            await this.dialogMessageService.showMessage(
              'Upload Mapping',
              'Mapping records uploaded successfully without errors'
            );
            this.showUploadSection = false;
            this.selectedFile = null;
            this.loadData(this.detail?.id);
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
      const id = +params.id; // (+) converts string 'id' to a number
      if (id) {
        this.loadData(id);
      } else {
        this.loadData(params.id);
      }
      // In a real app: dispatch action to load the details here.
    });
  }
  loadData(id: any) {
    if (id) {
      this.loading = true;
      this.itemCodesService.getSegmentDetail(id).subscribe(
        result => {
          this.detail = result;
          if (
            this.detail.childSegment &&
            this.detail.childSegment.isLinkedCodeList &&
            this.detail.isLinkedCodeList
          ) {
            this.showChildMapping = true;
          } else {
            this.showChildMapping = false;
          }
          this.loading = false;
        },
        async err => {
          this.loading = false;
          await this.dialogMessageService.error('Segment Detail', err);
        }
      );
    }
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
    this.itemCodesService.deleteCodeMappings(mappings).subscribe(
      async result => {
        this.blockUI?.stop();
        this.loadData(this.detail?.id);
      },
      async err => {
        this.blockUI?.stop();
        await this.dialogMessageService.error('Delete Mappings', err);
      }
    );
  }
  codeRecordUpdaing(e: any) {
    e.cancel = true;
    const finalData = Object.assign(e.oldData, e.newData);
    this.blockUI?.start(`Updating code ${e.oldData.name}`);

    this.itemCodesService.saveItemCode(finalData).subscribe(
      async result => {
        this.blockUI?.stop();
        this.loadData(this.detail?.id);
      },
      async err => {
        this.blockUI?.stop();
        await this.dialogMessageService.error('Update code', err);
      }
    );
  }
  codeRecordInserting(e: any) {
    e.cancel = true;
    this.blockUI?.start(`Adding code ${e.data.name}`);
    e.data.listID = this.detail?.itemCodeListID;
    this.itemCodesService.saveItemCode(e.data).subscribe(
      async result => {
        this.blockUI?.stop();
        this.loadData(this.detail?.id);
      },
      async err => {
        this.blockUI?.stop();
        await this.dialogMessageService.error('Add code', err);
      }
    );
  }
  codeRecordDeleted(e: any) {
    if (e && e.data) {
      const recs: Array<ItemCode> = [];
      recs.push(e.data);
      this.deleteCodes(recs);
      e.cancel = true;
    }
  }

  deleteCodes(codes: Array<ItemCode>) {
    this.blockUI?.start('Deleting code mappings...');
    this.itemCodesService.deleteItemCode(codes).subscribe(
      async result => {
        this.blockUI?.stop();
        this.loadData(this.detail?.id);
      },
      async err => {
        this.blockUI?.stop();
        await this.dialogMessageService.error('Delete Mappings', err);
      }
    );
  }

  async deleteSelectedCodes(e: any) {
    if (this.codesDataGrid?.selectedRowKeys) {
      const result = await this.dialogMessageService.confirm(
        'Delete Mappings',
        'Are you sure you want to delete all the selected codes, it will also delete its related mappings?'
      );
      if (result) {
        this.deleteCodes(this.codesDataGrid?.selectedRowKeys);
      }
    }
  }
  navigateToChild() {
    if (this.detail && this.detail?.childSegment) {
      this.router.navigate(['/item-codes', this.detail?.childSegment.name]);
    }
  }
  navigateToParent() {
    if (this.detail && this.detail?.parentSegment) {
      this.router.navigate(['/item-codes', this.detail?.parentSegment.name]);
    }
  }
}
