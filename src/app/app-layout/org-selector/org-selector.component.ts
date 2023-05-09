import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrgType, Organization, User } from 'app/_models';
import {
  AuthService,
  ClientService,
  CompanyService,
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
  clients?: Organization[];
  companies?: Organization[];
  user?: User;
  constructor(
    private auth: AuthService,
    private companyService: CompanyService,
    private clientService: ClientService,
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
            const clientsApiCall = this.clientService.getAll();
            const companysApiCall = this.companyService.getAll();
            const permissionApiCall = this.permissionsService.getAllForUser(user.id);
            forkJoin([permissionApiCall, clientsApiCall, companysApiCall]).subscribe(results => {
              const permissions = results[0];
              this.clients = results[1].filter(x => permissions.some(p => p.clientID === x.id));
              this.companies = results[2].filter(x =>
                permissions.some(p => p.companyID === x.id || (!p.companyID && !p.clientID))
              );
              const userSettings = this.settings.getUserSetting(user.id!);
              if (userSettings) {
                if (userSettings.selectedOrganization?.type  === OrgType.Company) {
                  userSettings.selectedOrganization = this.companies?.find(
                    x => x.id === userSettings.selectedOrganization?.id
                  );
                } else if (userSettings.selectedOrganization?.type  === OrgType.Client) {
                  userSettings.selectedOrganization = this.clients?.find(
                    x => x.id === userSettings.selectedOrganization?.id
                  );
                }
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

  private selectOrg(organization: Organization, orgType: 'client' | 'company') {
    if (this.user?.id) {
      const setting = this.settings.getUserSetting(this.user?.id) ?? {};
      setting.userId = this.user?.id;
      setting.selectedOrganization = organization;
      this.settings.setUserSetting(this.user?.id, setting);
    }
  }

  selectClient(organization: Organization) {
    this.selectOrg(organization, 'client');
  }

  selectCompnay(organization: Organization) {
    this.selectOrg(organization, 'company');
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
