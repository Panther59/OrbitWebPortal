import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrgType, Organization, User } from 'app/_models';
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
            const orgsApiCall = this.organizationService.getAll();
            const permissionApiCall = this.permissionsService.getAllForUser(user.id);
            forkJoin([permissionApiCall, orgsApiCall]).subscribe(results => {
              const permissions = results[0];
              this.organizations = results[1].filter(x =>
                permissions.some(p => p.organizationID === x.id)
              );
              const userSettings = this.settings.getUserSetting(user.id!);
              if (userSettings) {
                userSettings.selectedOrganization = this.organizations?.find(
                  x => x.id === userSettings.selectedOrganization?.id
                );
                if (user.id) {
                  this.settings.setUserSetting(user.id, userSettings);
                }
              }
              this.loaded = true;
              this.cdr.detectChanges();
            });
          } else {
            this.organization = undefined;
            this.cdr.detectChanges();
          }
        }),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());

    this.settings.notifyUserSetting.subscribe(x => {
      if (this.user && this.user.id === x.userId) {
        this.organization = x.selectedOrganization;
      } else {
        this.organization = undefined;
      }

      this.cdr.detectChanges();
    });
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
