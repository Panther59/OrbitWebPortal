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
  constructor(private cdr: ChangeDetectorRef, private settings: SettingsService) {
    this.settings.notifyOrganization.subscribe(x => {
      this.setOrganizationDetail(x);
    });
  }
  setOrganizationDetail(x?: Organization) {
    this.selectedOrg = x;
    this.loaded = true;
    this.cdr.detectChanges();
  }

  ngOnInit() {}
}
