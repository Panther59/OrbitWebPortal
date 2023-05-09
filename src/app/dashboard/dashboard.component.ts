import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppSettings, Organization } from 'app/_models';
import { AuthService, SettingsService } from 'app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  loaded = false;
  selectedOrg?: Organization;
  constructor(
    private cdr: ChangeDetectorRef,
    private settings: SettingsService,
    private authService: AuthService
  ) {}

  setOrganizationDetail() {
    if (this.authService.userData && this.authService.userData.id) {
      const userSetting = this.settings.getUserSetting(this.authService.userData.id);
      if (userSetting && userSetting.selectedOrganization)
        this.selectedOrg = userSetting.selectedOrganization;
      this.loaded = true;
    }
  }

  ngOnInit() {
    // this.setOrganizationDetail();
    this.settings.notifyUserSetting.subscribe(x => {
      this.setOrganizationDetail();
      this.cdr.detectChanges();
    });

    this.authService.user().subscribe(x => {
      this.setOrganizationDetail();
      this.cdr.detectChanges();
    });
  }
}
