import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Organization } from 'app/_models';
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
          if (user.id) {
            const clientsApiCall = this.clientService.getAll();
            const companysApiCall = this.companyService.getAll();
            const permissionApiCall = this.permissionsService.getAllForUser(user.id);
            forkJoin([permissionApiCall, clientsApiCall, companysApiCall]).subscribe(results => {
              const permissions = results[0];
              this.clients = results[1].filter(x => permissions.some(p => p.clientID === x.id));
              this.companies = results[2].filter(x =>
                permissions.some(p => p.companyID === x.id || (!p.companyID && !p.clientID))
              );
              const settings = this.settings.getOptions();
              if (settings.selectedOrganizationType === 'company') {
                this.settings.setOrganization(
                  this.companies?.find(x => x.id === settings.selectedOrganization)
                );
              } else if (settings.selectedOrganizationType === 'client') {
                this.settings.setOrganization(
                  this.clients?.find(x => x.id === settings.selectedOrganization)
                );
              }

              this.loaded = true;
              this.cdr.detectChanges();
            });
          }
        }),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());

    this.settings.notifyOrganization.subscribe(x => {
      this.organization = x;
      this.cdr.detectChanges();
    });
  }

  private selectOrg(organization: Organization, orgType: 'client' | 'company') {
    const setting = this.settings.getOptions();
    setting.selectedOrganization = organization.id;
    setting.selectedOrganizationType = orgType;
    this.settings.setOptions(setting);

    this.settings.setOrganization(organization);
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
