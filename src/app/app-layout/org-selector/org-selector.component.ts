import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrgType, Organization, User, UserSettings } from 'app/_models';
import {
  AuthService,
  OrganizationService,
  PermissionsService,
  SettingsService,
} from 'app/_services';
import { debounceTime, forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-org-selector',
  templateUrl: './org-selector.component.html',
  styleUrls: ['./org-selector.component.scss'],
})
export class OrgSelectorComponent implements OnInit {
  loaded = false;
  organization?: Organization;
  organizations?: Organization[];
  user?: User;
  constructor(
    private auth: AuthService,
    private organizationService: OrganizationService,
    private permissionsService: PermissionsService,
    private cdr: ChangeDetectorRef,
    private settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => {
          this.user = user;
          if (user.id !== undefined) {
            const userSettings = this.settings.getUserSetting(user.id!);
            if (userSettings) {
              this.setOrg(userSettings);
            }
            this.loaded = true;
            this.cdr.detectChanges();
          } else {
            this.organization = undefined;
            this.cdr.detectChanges();
          }
        }),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());

    this.settings.notifyUserSetting.subscribe(x => {
      this.setOrg(x);
      this.cdr.detectChanges();
    });
  }

  setOrg(userSetting: UserSettings) {
    if (this.user && this.user.id === userSetting.userId) {
      this.organization = userSetting.selectedOrganization;
    } else {
      this.organization = undefined;
    }
  }

  selectOrg(organization: Organization) {
    if (this.user?.id) {
      const setting = this.settings.getUserSetting(this.user?.id) ?? {};
      setting.userId = this.user?.id;
      setting.selectedOrganization = organization;
      this.settings.setUserSetting(this.user?.id, setting);
    }
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
