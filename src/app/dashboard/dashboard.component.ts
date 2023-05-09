import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppSettings, Organization } from 'app/_models';
import { SettingsService } from 'app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  loaded = false;
  selectedOrg?: Organization;
  constructor(private cdr: ChangeDetectorRef, private settings: SettingsService) {}
  setOrganizationDetail(x?: Organization) {
    this.selectedOrg = x;
    this.loaded = true;
  }

  ngOnInit() {
    //this.setOrganizationDetail(this.settings.getOrganization());
    this.settings.notifyUserSetting.subscribe(x => {
      this.setOrganizationDetail(x.selectedOrganization);
      this.cdr.detectChanges();
    });
  }
}
