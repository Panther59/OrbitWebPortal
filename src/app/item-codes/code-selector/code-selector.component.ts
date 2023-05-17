import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ItemCodeSegment, SelectorItemCodeSegment } from 'app/_models';
import { ItemCodesService, ItemMasterService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';

@Component({
  selector: 'app-code-selector',
  templateUrl: './code-selector.component.html',
  styleUrls: ['./code-selector.component.scss'],
})
export class CodeSelectorComponent implements OnInit {
  loading = false;
  segments: SelectorItemCodeSegment[] = [];
  itemCode = '';
  constructor(
    private itemCodesService: ItemCodesService,
    private itemMasterService: ItemMasterService,
    private dialogMessageService: DialogMessageService
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.itemMasterService.getAll<SelectorItemCodeSegment>().subscribe(
      segments => {
        this.segments = segments;
        this.itemCodesService.getCodes(this.segments[0].itemCodeListID!).subscribe(x => {
          this.segments[0].codes = x;
          this.loading = false;
        });

        const dict: any = {};
        this.segments
          .filter(x => !x.isLinkedCodeList)
          .forEach(async seg => {
            if (dict[seg.itemCodeListID!]) {
              seg.codes = dict[seg.itemCodeListID!];
            } else {
              const codes = await this.itemCodesService.getCodes(seg.itemCodeListID!).toPromise();
              if (codes) {
                dict[seg.itemCodeListID!] = codes;
                seg.codes = codes;
              }
            }

            seg.positionCodes = {};
            seg.selectedPositionCodes = {};
            for (let index = 0; index < seg.maxLength!; index++) {
              seg.positionCodes[index] = [];
              seg.selectedPositionCodes[index] = 0;
            }
            seg.positionCodes[0] = seg.codes;
          });
      },
      async error => {
        this.loading = false;
        await this.dialogMessageService.error('Item Master', error);
      }
    );
  }
  selectionChangeStaticSeg(e: any, segIndex: number) {
    if (segIndex >= 0 && this.segments.length > segIndex) {
      if (segIndex + 1 < this.segments.length && this.segments[segIndex + 1].isLinkedCodeList) {
        this.itemCodesService
          .getCodes(
            this.segments[segIndex + 1].itemCodeListID!,
            this.segments[segIndex].selectedCode
          )
          .subscribe(x => {
            this.segments[segIndex + 1].codes = x;
            this.loading = false;
          });
      }
    }

    this.setItemCode();
  }

  selectionChangeDynamicSeg(e: any, index: number, segIndex: number) {
    if (index >= 0 && this.segments[segIndex].maxLength! > index) {
      let codes = this.segments[segIndex].codes;
      for (let si = 0; si < this.segments.length; si++) {
        if (!this.segments[si].isLinkedCodeList) {
          for (let i = 0; i <= this.segments[si].maxLength!; i++) {
            this.segments[si].positionCodes[i] = codes;
            if (this.segments[si].selectedPositionCodes[i]) {
              codes = codes.filter(x => x.id !== this.segments[si].selectedPositionCodes[i]);
            }
          }
        }
      }
    }
    this.setItemCode();
  }

  setItemCode() {
    let code = '';
    for (let si = 0; si < this.segments.length; si++) {
      if (this.segments[si].isLinkedCodeList) {
        if (this.segments[si] && this.segments[si].selectedCode && this.segments[si].codes) {
          code = `${code}${
            this.segments[si].codes.find(x => x.id === this.segments[si].selectedCode!)?.code
          }`;
        } else {
          code = `${code}0`;
        }
      } else {
        for (let i = 0; i < this.segments[si].maxLength!; i++) {
          if (this.segments[si].selectedPositionCodes[i]) {
            code = `${code}${
              this.segments[si].positionCodes[i].find(
                (x: { id: number }) => x.id === this.segments[si].selectedPositionCodes[i]!
              )?.code
            }`;
          } else {
            code = `${code}0`;
          }
        }
      }

      if (si < this.segments.length - 1) {
        code = `${code}-`;
      }
    }

    this.itemCode = code;
  }
}
